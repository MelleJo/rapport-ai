import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createSectionPrompt } from 'utils/promptBuilder';

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
    // Parse JSON body instead of form data
    const body = await req.json();
    const { transcript } = body;
    
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is vereist' },
        { status: 400 }
      );
    }

    const promptData = {
      klantprofiel: "", // We'll handle klantprofiel later if needed
      transcript: transcript
    };

    // Generate each section
    const sections = await Promise.all(
      REQUIRED_SECTIONS.map(async (section) => {
        const sectionPrompt = createSectionPrompt(section, promptData);
        
        const completion = await openai.chat.completions.create({
          messages: [{ role: "user", content: sectionPrompt }],
          model: "gpt-4",
          temperature: 0.7,
        });

        return {
          title: section,
          content: completion.choices[0].message.content || 'Geen inhoud gegenereerd'
        };
      })
    );

    // Validate that we have content
    if (sections.every(section => !section.content)) {
      throw new Error('Geen secties konden worden gegenereerd');
    }

    return NextResponse.json({ sections });

  } catch (error) {
    console.error('Error generating sections:', error);
    return NextResponse.json(
      { error: 'Fout bij het genereren van secties: ' + (error instanceof Error ? error.message : 'Onbekende fout') },
      { status: 500 }
    );
  }
}
