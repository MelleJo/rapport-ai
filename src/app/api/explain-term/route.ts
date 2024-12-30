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
    const { term, context } = await req.json();

    if (!term) {
      return NextResponse.json(
        { error: 'Term is required' },
        { status: 400 }
      );
    }

    const prompt = `Je bent een ervaren financieel adviseur die complexe financiële termen uitlegt aan klanten.

Term om uit te leggen: ${term}

Context waarin de term voorkomt:
${context}

Genereer een heldere, beknopte uitleg van deze term die:
1. Begrijpelijk is voor mensen zonder financiële achtergrond
2. Relevant is binnen de gegeven context
3. Ongeveer 2-3 zinnen lang is
4. In natuurlijk Nederlands is geschreven
5. Direct aansluit op de bestaande tekst

De uitleg moet naadloos kunnen worden ingevoegd in een bestaande tekst, dus:
- Begin niet met "Dit is" of "[term] is"
- Gebruik geen opsommingstekens of nummering
- Vermijd verwijzingen naar "deze term" of "dit concept"

Geef alleen de uitleg zelf, zonder inleiding of extra context.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 150,
    });

    const explanation = completion.choices[0].message.content?.trim();

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error('Error generating explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    );
  }
}