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
  formData.append('apikey', process.env.OCR_SPACE_API_KEY!)
  formData.append('language', 'eng')
  formData.append('isOverlayRequired', 'false')
  formData.append('OCREngine', '2')

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  })

  const responseText = await response.text()

  console.log('OCR STATUS:', response.status)
  console.log('OCR RESPONSE:', responseText)

  return new NextResponse(responseText, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}