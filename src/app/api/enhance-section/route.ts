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
    const { content, instruction, title } = await req.json();

    const prompt = `Je bent een ervaren hypotheekadviseur die een rapportsectie moet aanpassen.

HUIDIGE TEKST:
${content}

INSTRUCTIE:
${instruction}

BELANGRIJKE REGELS:
1. Behoud alle specifieke bedragen en percentages uit de originele tekst
2. Gebruik dezelfde naamplaceholders ([klant_man] en [klant_vrouw])
3. Behoud de professionele toon
4. Houd de formattering intact (gebruik van ** voor koppen)
5. Pas alleen aan wat nodig is volgens de instructie
6. Behoud alle belangrijke financiële informatie
7. Zorg dat de nieuwe tekst past bij de sectie "${title}"

Geef alleen de aangepaste tekst terug, zonder uitleg of opmerkingen.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.5,
    });

    return NextResponse.json({
      enhancedContent: completion.choices[0].message.content || content
    });

  } catch (error) {
    console.error('Error enhancing section:', error);
    return NextResponse.json(
      { error: 'Failed to enhance section' },
      { status: 500 }
    );
  }
}