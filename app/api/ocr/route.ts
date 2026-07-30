import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const incomingForm = await req.formData()

  const file = incomingForm.get('file')

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      { status: 400 }
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('language', 'eng')
  formData.append('isOverlayRequired', 'false')
  formData.append('OCREngine', '2')

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      apikey: process.env.OCR_SPACE_API_KEY!,
    },
    body: formData,
  })

  const result = await response.json()

  console.log(result)

  return NextResponse.json({
    text: result?.ParsedResults?.[0]?.ParsedText ?? '',
  })
}