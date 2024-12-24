import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a new File object from the buffer
    const file = new File([buffer], 'audio.webm', { type: audioFile.type });

    try {
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: file,
        language: "nl",
        response_format: "text",
      });

      return NextResponse.json({ transcript: transcription });

    } catch (error) {
      console.error('OpenAI transcription error:', error);
      return NextResponse.json(
        { error: 'Error during transcription' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Error processing request' },
      { status: 500 }
    );
  }
}