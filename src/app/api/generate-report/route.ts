import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const reportSections = [
  {
    title: "Uitwerking huidige situatie",
    description: "Beschrijf de huidige financiële situatie voor en na het advies",
    requiredGraphs: ["Grafiek: Netto besteedbaar inkomen - Huidige situatie"]
  },
  {
    title: "Uitwerking financiële situatie later (pensioen)",
    description: "Analyseer de pensioensituatie voor en na het advies",
    requiredGraphs: ["Grafiek: Pensioeninkomen", "Grafiek: Vermogensopbouw pensioen"]
  },
  {
    title: "Uitwerking financiële situatie overlijden",
    description: "Beschrijf de financiële impact bij overlijden voor en na het advies",
    requiredGraphs: ["Grafiek: Inkomen bij overlijden partner"]
  },
  {
    title: "Uitwerking financiële situatie arbeidsongeschiktheid",
    description: "Analyseer de financiële situatie bij arbeidsongeschiktheid",
    requiredGraphs: ["Grafiek: Inkomen bij arbeidsongeschiktheid"]
  },
  {
    title: "Advies over erven en schenken",
    description: "Geef advies over de mogelijkheden voor erven en schenken",
    requiredGraphs: []
  }
];

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is vereist' },
        { status: 400 }
      );
    }

const prompt = `Je bent een ervaren financieel adviseur die een gedetailleerd financieel adviesrapport schrijft uitsluitend op basis van het gespreksverslag. Gebruik alleen de informatie uit het gespreksverslag zonder eigen mening of suggesties toe te voegen.

Gespreksverslag:
${transcript}

Genereer een compleet financieel adviesrapport met de volgende structuur. Gebruik de standaardteksten uit het sjabloon waar van toepassing.

1. Een samenvatting van het advies
2. Voor elk van de volgende secties, genereer een "voor advies" en "na advies" analyse:
   - Uitwerking huidige situatie
   - Financiële situatie later (pensioen)
   - Financiële situatie overlijden
   - Financiële situatie arbeidsongeschiktheid
3. Advies over erven en schenken
4. Concrete actiepunten voor zowel de cliënt als de adviseur

Wanneer je naar grafieken verwijst, gebruik de placeholder [Grafiek: naam] die later vervangen zal worden.

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
