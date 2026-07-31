import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    hasKey: !!process.env.OCR_SPACE_API_KEY,
    firstTwo: process.env.OCR_SPACE_API_KEY?.slice(0, 2),
    length: process.env.OCR_SPACE_API_KEY?.length,
  })
}