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
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is vereist' },
        { status: 400 }
      );
    }

    const prompt = `Je bent een ervaren financieel adviseur die controleert of alle benodigde informatie voor een financieel adviesrapport aanwezig is.

Analyseer het volgende gespreksverslag en identificeer welke essentiële informatie ontbreekt voor een volledig financieel advies. Focus op de volgende gebieden, maar ALLEEN als ze relevant zijn voor dit specifieke gesprek:

- Netto besteedbaar inkomen (inkomen, vaste lasten, gewenst besteedbaar bedrag)
- Pensioensituatie (opbouw, AOW, gewenst inkomen)
- Overlijdensrisico (voorzieningen, hypotheek, nabestaanden)
- Arbeidsongeschiktheid (dekkingen, werkgeversvoorzieningen)
- Werkloosheid (voorzieningen, buffer)
- Erven en schenken (vermogen, wensen)
- Hypotheek (indien van toepassing)
- Kinderen en studiekosten (indien van toepassing)
- Specifieke financiële doelen of wensen

Gespreksverslag:
${transcript}

Geef aan welke specifieke informatie nog ontbreekt voor een gedegen advies. Focus alleen op informatie die:
1. Relevant is gezien de context van het gesprek
2. Essentieel is voor het kunnen geven van gedegen advies
3. Niet af te leiden is uit andere informatie in het transcript

Antwoord in het volgende JSON formaat:
{
  "missingInformation": [
    "Specifieke omschrijvingen van ontbrekende informatie"
  ],
  "complete": boolean,
  "context": "Korte toelichting waarom deze informatie belangrijk is"
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{"missingInformation": [], "complete": false}');

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error analyzing transcript:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het analyseren van het gespreksverslag' },
      { status: 500 }
    );
  }
}