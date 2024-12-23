import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { customerData, advisorNotes } = await req.json();

    const prompt = `
    Je bent een ervaren financieel adviseur die een hypotheekadvies rapport schrijft. 
    Gebruik de volgende klantgegevens en adviseur notities om een gestructureerd adviesrapport te genereren.

    Klantgegevens:
    - Naam: ${customerData.naam}
    - Jaarlijks Inkomen: €${customerData.inkomen}
    - Leeftijd: ${customerData.leeftijd}
    - Woning Waarde: €${customerData.woningWaarde}
    - Eigen Vermogen: €${customerData.eigenVermogen}

    Adviseur Notities:
    ${advisorNotes}

    Genereer een professioneel hypotheekadvies rapport met de volgende secties:
    1. Samenvatting klantsituatie
    2. Leencapaciteit analyse
    3. Hypotheekvormen advies
    4. Risico's en aandachtspunten
    5. Conclusie en aanbevelingen

    Het rapport moet formeel maar begrijpelijk zijn, met concrete aanbevelingen.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o",
      temperature: 0.7,
    });

    return NextResponse.json({
      report: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het genereren van het rapport' },
      { status: 500 }
    );
  }
}