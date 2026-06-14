import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'SET (' + process.env.GEMINI_API_KEY.substring(0, 15) + '...)' : 'NOT SET',
    GEMINI_API_KEY_BACKUP: process.env.GEMINI_API_KEY_BACKUP ? 'SET (' + process.env.GEMINI_API_KEY_BACKUP.substring(0, 15) + '...)' : 'NOT SET',
  });
}
