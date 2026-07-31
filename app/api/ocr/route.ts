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

    // -------------------------
    // Image preprocessing
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
    // Gemini cleanup
    // -------------------------

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `
You are cleaning OCR extracted lecture notes.

Rules:
- Never invent information.
- Never remove information.
- Fix OCR mistakes.
- Fix capitalization.
- Fix punctuation.
- Preserve headings.
- Preserve numbered lists.
- Preserve bullet points.
- Preserve equations exactly.
- Preserve spacing where possible.

Return ONLY the cleaned lecture notes.

OCR:

${rawText}
`,
      })

      return NextResponse.json({
        text: result.text?.trim() || rawText,
      })
    } catch (err: any) {
      console.error('GEMINI ERROR')
      console.error(JSON.stringify(err, null, 2))

      // Fall back to raw OCR if Gemini fails
      return NextResponse.json({
        text: rawText,
      })
    }
  } catch (err: any) {
    console.error('SERVER ERROR')
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