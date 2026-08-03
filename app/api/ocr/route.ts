import { NextResponse } from 'next/server'
import sharp from 'sharp'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const incomingForm = await req.formData()

    const file = incomingForm.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // -------------------------
    // Improve image for OCR
    // -------------------------

    const buffer = Buffer.from(await file.arrayBuffer())

    const processed = await sharp(buffer)
      .rotate()
      .resize({
        width: 2200,
        withoutEnlargement: false,
      })
      .grayscale()
      .normalize()
      .sharpen()
      .threshold(180)
      .png()
      .toBuffer()

    // -------------------------
    // OCR.space
    // -------------------------

    const formData = new FormData()

    formData.append(
      'file',
      new Blob([processed], {
        type: 'image/png',
      }),
      'lecture.png'
    )

    formData.append('apikey', process.env.OCR_SPACE_API_KEY!)
    formData.append('language', 'eng')
    formData.append('OCREngine', '2')
    formData.append('scale', 'true')
    formData.append('isOverlayRequired', 'false')

    const ocrResponse = await fetch(
      'https://api.ocr.space/parse/image',
      {
        method: 'POST',
        body: formData,
      }
    )

    const ocrResult = await ocrResponse.json()

    const rawText =
      ocrResult?.ParsedResults?.[0]?.ParsedText ?? ''

    if (!rawText.trim()) {
      return NextResponse.json({
        text: '',
      })
    }

    // -------------------------
    // Clean OCR with Groq
    // -------------------------

    const completion =
      await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',

        temperature: 0.1,

        messages: [
          {
            role: 'system',
            content: `
You clean OCR extracted lecture notes.

Rules:

- Never invent information.
- Never remove information.
- Fix obvious OCR mistakes.
- Correct capitalization.
- Correct punctuation.
- Preserve bullet points.
- Preserve numbered lists.
- Preserve equations.
- Preserve headings.
- Preserve formatting.
- Return ONLY the cleaned notes.
`,
          },
          {
            role: 'user',
            content: rawText,
          },
        ],
      })

    const cleaned =
      completion.choices[0]?.message?.content?.trim() ??
      rawText

    return NextResponse.json({
      text: cleaned,
    })
  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    )
  }
}