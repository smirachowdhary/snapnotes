import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      apikey: process.env.OCR_SPACE_API_KEY!,
    },
    body: formData,
  })

  const data = await response.json()

  return NextResponse.json({
    text: data.ParsedResults?.[0]?.ParsedText ?? '',
  })
}