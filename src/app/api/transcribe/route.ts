import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get('audio');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No audio file provided or invalid file' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create file object for OpenAI API
    const audioFile = new File([buffer], 'audio.webm', { type: file.type });

    try {
      // Create transcription directly without saving to disk
      const transcription = await openai.audio.transcriptions.create({
        model: "whisper-1",
        file: audioFile,
        language: "nl",
        response_format: "text",
      });

      // Since response_format is "text", transcription is directly a string
      return NextResponse.json({ transcript: transcription });

    } catch (error) {
      console.error('OpenAI transcription error:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error in transcription:', error);
    return NextResponse.json(
      { error: 'Error processing audio: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}