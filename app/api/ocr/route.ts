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
    // Preprocess image
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
      new Blob([processed], { type: 'image/png' }),
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
You are cleaning OCR lecture notes.

Rules:
- Never invent information.
- Never remove information.
- Correct OCR mistakes only.
- Preserve bullets.
- Preserve numbering.
- Preserve formatting.
- Return ONLY the cleaned notes.

${rawText}
`,
      })

      return NextResponse.json({
        text: result.text?.trim() || rawText,
      })
    } catch (err: any) {
      console.error('==============================')
      console.error('GEMINI ERROR')
      console.error('message:', err?.message)
      console.error('status:', err?.status)
      console.error('name:', err?.name)
      console.error('stack:', err?.stack)

      if (err?.error) {
        console.error(
          'error:',
          JSON.stringify(err.error, null, 2)
        )
      }

      if (err?.cause) {
        console.error(
          'cause:',
          JSON.stringify(err.cause, null, 2)
        )
      }

      console.error(
        'FULL OBJECT:',
        JSON.stringify(
          err,
          Object.getOwnPropertyNames(err),
          2
        )
      )
      console.error('==============================')

      // Return OCR anyway
      return NextResponse.json({
        text: rawText,
      })
    }
  } catch (err: any) {
    console.error('SERVER ERROR')
    console.error(err)

    return NextResponse.json(
      {
        error: err?.message || 'Unknown server error',
      },
      {
        status: 500,
      }
    )
  }
}