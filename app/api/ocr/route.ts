import { NextResponse } from 'next/server'
import sharp from 'sharp'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
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

    // -----------------------
    // Improve image for OCR
    // -----------------------

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

    // -----------------------
    // OCR.space
    // -----------------------

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

    // -----------------------
    // Gemini Cleanup
    // -----------------------

    const gemini = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
You are cleaning OCR extracted lecture notes.

Rules:

- Never invent information.
- Never remove information.
- Fix OCR mistakes.
- Fix capitalization.
- Fix punctuation.
- Restore headings.
- Restore numbered lists.
- Restore bullet points.
- Preserve equations.
- Preserve scientific notation.
- Preserve indentation.
- Return ONLY the cleaned lecture notes.

OCR:

${rawText}
`,
    })

    const cleaned =
      gemini.text?.trim() ||
      rawText

    return NextResponse.json({
      text: cleaned,
    })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      {
        error: 'OCR failed',
      },
      {
        status: 500,
      }
    )
  }
}