import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createSectionPrompt } from '@/utils/promptBuilder';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const REQUIRED_SECTIONS = [
  "Algemeen",
  "Verantwoord lenen en betalen",
  "Adviesmotivatie hypotheek",
  "Adviesmotivatie overbrugging",
  "Adviesmotivatie arbeidsongeschiktheid",
  "Adviesmotivatie werkloosheid",
  "Adviesmotivatie AOW",
  "Adviesmotivatie overlijden",
  "Adviesmotivatie einde relatie"
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, klantprofiel } = body;
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is vereist' },
        { status: 400 }
      );
    }

    const promptData = {
      transcript,
      klantprofiel
    };

    // Generate each section
    const sections = await Promise.all(
      REQUIRED_SECTIONS.map(async (section) => {
        try {
          const sectionPrompt = createSectionPrompt(section, promptData);
          
          const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: sectionPrompt }],
            model: "gpt-4o",
            temperature: 0.5,
            max_tokens: 1500,  // Adjust based on your needs
          });

          return {
            title: section,
            content: completion.choices[0].message.content || 'Geen inhoud gegenereerd'
          };
        } catch (error) {
          console.error(`Error generating section ${section}:`, error);
          const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
          return {
            title: section,
            content: `Fout bij het genereren van deze sectie: ${errorMessage}`
          };
        }
      })
    );

    return NextResponse.json({ sections });

  } catch (error) {
    console.error('Error generating sections:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
    return NextResponse.json(
      { error: 'Fout bij het genereren van secties: ' + errorMessage },
      { status: 500 }
    );
  }
}
