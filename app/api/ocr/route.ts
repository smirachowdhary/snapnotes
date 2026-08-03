import { NextResponse } from 'next/server'
import sharp from 'sharp'
import Groq from 'groq-sdk'
import { createClient } from '@supabase/supabase-js'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Flashcard = {
  question: string
  answer: string
}

type AIResponse = {
  subject: string
  subjectIcon: string
  subjectColor: string
  confidence: number
  title: string
  notes: string
  summary: string
  flashcards: Flashcard[]
}

async function askGroq(rawText: string): Promise<AIResponse> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',

    temperature: 0.2,

    response_format: {
      type: 'json_object',
    },

    messages: [
      {
        role: 'system',
content: `
You are SnapNotes AI.

Return ONLY valid JSON.

{
  "subject":"",
  "subjectIcon":"",
  "subjectColor":"",
  "confidence":0,
  "title":"",
  "notes":"",
  "summary":"",
  "flashcards":[
    {
      "question":"",
      "answer":""
    }
  ]
}

Rules

- Never invent information.
- Fix OCR mistakes.
- Create clean study notes.
- Generate 5-10 flashcards.
- Summary should be 3-5 sentences.
- Confidence must be between 0 and 1.

Icons:

Biology 🧬
Chemistry ⚗️
Physics ⚛️
Math 📐
Calculus 📐
English 📖
History 🏛️
Computer Science 💻
Economics 📈
Psychology 🧠
Art 🎨
Music 🎵
Other 📁

Colors:

Biology emerald
Chemistry purple
Physics blue
Math orange
Calculus orange
English red
History amber
Computer Science cyan
Economics green
Psychology pink
Art rose
Music violet
Other gray

If you are not confident,
return:

subject = "Other"
subjectIcon = "📁"
subjectColor = "gray"
confidence = 0
`,
      },
      {
        role: 'user',
        content: rawText,
      },
    ],
  })

  const content =
    completion.choices[0].message.content ?? '{}'

  return JSON.parse(content)
}

export async function POST(req: Request) {
  try {
    const incoming = await req.formData()

    const file = incoming.get('file')

    const userId = incoming.get('userId') as string

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: 'No file uploaded',
        },
        {
          status: 400,
        }
      )
    }

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

    const ocrForm = new FormData()

    ocrForm.append(
      'file',
      new Blob([processed], {
        type: 'image/png',
      }),
      'lecture.png'
    )

    ocrForm.append(
      'apikey',
      process.env.OCR_SPACE_API_KEY!
    )

    ocrForm.append('language', 'eng')
    ocrForm.append('OCREngine', '2')
    ocrForm.append('scale', 'true')
    ocrForm.append(
      'isOverlayRequired',
      'false'
    )

    const ocrResponse = await fetch(
      'https://api.ocr.space/parse/image',
      {
        method: 'POST',
        body: ocrForm,
      }
    )

    const ocr = await ocrResponse.json()

    const rawText =
      ocr?.ParsedResults?.[0]?.ParsedText ?? ''

    if (!rawText.trim()) {
      return NextResponse.json({
        error: 'No text detected.',
      })
    }

    const ai = await askGroq(rawText)

    let subjectName = ai.subject?.trim() || 'Other'
    let subjectIcon = ai.subjectIcon || '📁'
    let subjectColor = ai.subjectColor || 'gray'

    if (
    ai.confidence < 0.7 ||
    subjectName.length === 0 ||
    subjectName.toLowerCase() === 'unknown'
    ) {
    subjectName = 'Other'
    subjectIcon = '📁'
    subjectColor = 'gray'
    }

    // -------------------------
    // Upload original image
    // -------------------------

    const fileName = `${userId}/${Date.now()}-${file.name}`

    const { error: storageError } = await supabase.storage
      .from('lecture-images')
      .upload(fileName, file)

    if (storageError) {
      throw storageError
    }

    // -------------------------
    // Find or create subject
    // -------------------------

    let subjectId: string

    const { data: existingSubject } = await supabase
      .from('subjects')
      .select('id')
      .eq('user_id', userId)
      .ilike('name', subjectName)
      .maybeSingle()

    if (existingSubject) {
      subjectId = existingSubject.id
    } else {
      const { data: newSubject, error: subjectError } =
        await supabase
          .from('subjects')
          .insert({
            user_id: userId,
            name: subjectName,
            icon: subjectIcon,
            color: subjectColor,
            })
          .select('id')
          .single()

      if (subjectError) {
        throw subjectError
      }

      subjectId = newSubject.id
    }

    // -------------------------
    // Save lecture
    // -------------------------

    const { data: lecture, error: lectureError } =
      await supabase
        .from('lectures')
        .insert({
          user_id: userId,
          subject_id: subjectId,

          title: ai.title,

          image_url: fileName,

          ocr_text: rawText,

          notes: ai.notes,

          summary: ai.summary,

          flashcards: ai.flashcards,
        })
        .select()
        .single()

    if (lectureError) {
      throw lectureError
    }

    // -------------------------
    // Return to frontend
    // -------------------------

    return NextResponse.json({
      success: true,

      lecture,

      subject: subjectName,

      title: ai.title,

      notes: ai.notes,

      summary: ai.summary,

      flashcards: ai.flashcards,
    })
  } catch (err: any) {
    console.error(err)

    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    )
  }
}