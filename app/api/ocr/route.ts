import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.OCR_SPACE_API_KEY,
    firstTwo: process.env.OCR_SPACE_API_KEY?.slice(0, 2),
    length: process.env.OCR_SPACE_API_KEY?.length,
  })
}

export async function POST(req: Request) {
  const incomingForm = await req.formData()

  const file = incomingForm.get('file')

  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      { status: 400 }
    )
  }

  return NextResponse.json({ ok: true })
}