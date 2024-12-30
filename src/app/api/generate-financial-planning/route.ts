import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { standardTexts, selectStandardText } from '@/lib/standardTexts';

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

    const prompt = `Je bent een ervaren financieel adviseur die een gedetailleerd financieel adviesrapport schrijft op basis van een gespreksverslag.

Je hebt toegang tot standaard tekstblokken die je kunt gebruiken als basis voor je advies. Gebruik deze teksten wanneer van toepassing, maar:
1. Pas ze alleen toe als ze VOLLEDIG relevant zijn voor de situatie
2. Pas de teksten aan aan de specifieke situatie van de klant
3. Vul concrete bedragen en details in waar nodig
4. Combineer verschillende tekstblokken wanneer logisch
5. Schrijf eigen tekst wanneer de standaard teksten niet volledig passend zijn

Beschikbare standaard teksten:
${JSON.stringify(standardTexts, null, 2)}

Gespreksverslag:
${transcript}

Genereer een compleet financieel adviesrapport met de volgende structuur:

1. Samenvatting van het advies
2. Voor elk van de volgende secties, genereer een "voor advies" en "na advies" analyse:
   - Uitwerking huidige situatie (inclusief NBI)
   - Financiële situatie later (pensioen)
   - Financiële situatie overlijden
   - Financiële situatie arbeidsongeschiktheid
3. Advies over erven en schenken
4. Concrete actiepunten voor de cliënt en de adviseur

Belangrijke richtlijnen:
- Gebruik de standaard tekstblokken waar passend
- Vul concrete bedragen en percentages in
- Verwijs naar grafieken met [Grafiek: naam]
- Wees specifiek in aanbevelingen
- Gebruik professioneel taalgebruik
- Kies de juiste tekstblokken op basis van de situatie (zelfstandige/loondienst, wel/geen tekort, etc.)

Let op: de output moet exact de structuur van de standaard teksten volgen waar mogelijk, maar dan met de juiste bedragen en situatie-specifieke details ingevuld.

Antwoord in het volgende JSON formaat:
{
  "samenvatting": "string",
  "sections": [
    {
      "title": "string",
      "content": "string",
      "graphs": ["string"]
    }
  ],
  "actiepuntenClient": ["string"],
  "actiepuntenAdviseur": ["string"]
}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const report = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({ report });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het genereren van het rapport' },
      { status: 500 }
    );
  }
}