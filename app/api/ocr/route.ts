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
You are an expert note-taking assistant.

Your job is to transform OCR extracted lecture notes into beautiful, organized study notes.

IMPORTANT RULES

• Never invent facts.
• Never add information not present.
• Never remove important information.
• Correct OCR mistakes.
• Correct spelling and grammar.
• Rewrite sentences for clarity.
• Group related ideas together.
• Use Markdown formatting.

Always use this format when possible:

# Main Topic

## Definition
Explain the definition clearly.

## Key Concepts
• Bullet list

## Important Facts
• Bullet list

## Processes / Steps
1.
2.
3.

## Equations
Keep equations exactly as written.

## Vocabulary
| Term | Meaning |
|------|---------|

## Summary
2-5 sentence recap.

If information for a section doesn't exist, simply omit that section.

Return ONLY the formatted notes.
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