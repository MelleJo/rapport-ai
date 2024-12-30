interface PromptData {
  transcript: string;
  klantprofiel?: string;
}

export const PLACEHOLDERS = {
  MAN: '[klant_man]',
  VROUW: '[klant_vrouw]'
};

const basePrompt = `Je bent een ervaren adviseur die gedetailleerde motivatieteksten schrijft voor een rapport. Uitsluitend op basis van het gespreksverslag. Gebruik alleen de informatie uit het gespreksverslag zonder eigen mening of suggesties toe te voegen.

ESSENTIËLE INSTRUCTIES VOOR NAAMGEBRUIK:
- Gebruik ALTIJD [klant_man] voor de mannelijke partner
- Gebruik ALTIJD [klant_vrouw] voor de vrouwelijke partner
- Gebruik NOOIT alleen 'man', 'vrouw', 'meneer' of 'mevrouw'
- Gebruik deze placeholders consistent door het hele rapport

BELANGRIJKE SCHRIJFINSTRUCTIES:
1. Gebruik concrete getallen en bedragen uit het gesprek
2. Maak gebruik van kopjes met ## en ###
3. Focus alleen op de gevraagde sectie
4. Verwijs naar gemaakte keuzes en afspraken uit het gesprek
5. Onderbouw het advies met specifieke informatie van de klant
6. Gebruik alleen informatie die expliciet besproken of aangeleverd is
7. Schrijf in professioneel Nederlands
8. Rond alle bedragen af op hele euro's

KLANTGESPREK:
{transcript}

KLANTPROFIEL:
{klantprofiel}`;

const sectionInstructions: { [key: string]: string } = {
  algemeen: `
## Algemeen

### Klantsituatie en Wensen
[klant_man] en [klant_vrouw] overwegen de aankoop van een woning. Beschrijf hun:
- Persoonlijke situatie
- Werk- en inkomenssituatie
- Huidige woonsituatie
- Wensen en doelstellingen

### Belangrijkste Financiële Gegevens
- Koopsom woning: € ...
- Eigen inbreng: € ...
- Hypotheekbedrag: € ...
- Hypotheekvorm met onderbouwing
- Rentevaste periode
- Jaarlijkse aflossingsmogelijkheid
- Overlijdensrisicoverzekering

### Concrete Doelstellingen
1. Realiseren van de woningaankoop
2. Gewenste maandlasten
3. Overige financiële doelen`,

  'verantwoord lenen en betalen': `
## Verantwoord Lenen en Betalen

### Inkomensanalyse
- Inkomen [klant_man]: € ... bruto per jaar
- Inkomen [klant_vrouw]: € ... bruto per jaar
- Gezamenlijk toetsinkomen: € ...
- Toegestane financieringslast: ...%
- Maximale hypotheeklast: € ... per maand

### Lastenanalyse
- Gekozen hypotheeklast: € ... per maand
- Overige vaste lasten: € ... per maand
- Beschikbare buffers: € ...
- Resterende bestedingsruimte: € ...

### Toekomstige Ontwikkelingen
- Inkomensperspectief
- Verwachte lastenstijgingen
- Geplande gezinsuitbreiding
- Andere relevante factoren`,

  'adviesmotivatie hypotheek': `
## Adviesmotivatie Hypotheek

### Gekozen Hypotheekconstructie
- Hypotheekvorm(en)
- Totaalbedrag: € ...
- Looptijd: ... jaar
- Rentevaste periode: ... jaar
- Rentepercentage: ...%
- NHG: Ja/Nee

### Productdetails
- Geldverstrekker: ...
- Specifieke voorwaarden
- Boetevrij aflossen
- Meeneemregeling
- Verduurzamingsmogelijkheden

### Onderbouwing Keuzes
Beschrijf waarom deze constructie het beste past bij [klant_man] en [klant_vrouw].`,

  'adviesmotivatie overbrugging': `
## Adviesmotivatie Overbrugging

### Huidige Woningsituatie
- Waarde huidige woning: € ...
- Resterende hypotheek: € ...
- Beschikbare overwaarde: € ...

### Overbruggingsconstructie
- Overbruggingskrediet: € ...
- Looptijd: ...
- Rente: ...%
- Maandlast: € ...

### Risicoanalyse
- Verkoopbaarheid huidige woning
- Dubbele lasten periode
- Beschikbare buffers
- Noodscenario's`,

  'adviesmotivatie arbeidsongeschiktheid': `
## Adviesmotivatie Arbeidsongeschiktheid

### Huidige Inkomenssituatie
[klant_man] en [klant_vrouw] hebben op dit moment een stabiel inkomen, met allebei een fulltime dienstverband. Hun gezamenlijke inkomen stelt hen in staat om comfortabel de maandelijkse hypotheeklasten te dragen.

### Werkgeversvoorzieningen
Beschrijf voor zowel [klant_man] als [klant_vrouw]:
- WGA-jaarregeling
- Aanvullingen via werkgever
- Duur en hoogte van de uitkeringen

### WIA-uitkering en Dekking
Analyse van de WIA-uitkering voor beide partners:
- Uitkeringshoogte
- Voorwaarden
- Impact op inkomen
- Aanvullende behoeftes

### Impact op Hypotheeklasten
- Analyse betaalbaarheid bij arbeidsongeschiktheid
- Benodigde buffers
- Gewenste aanvullingen

### Aanvullende Voorzieningen
- Geadviseerde verzekeringen
- Alternatieve oplossingen
- Kostenanalyse`,

  'adviesmotivatie werkloosheid': `
## Adviesmotivatie Werkloosheid

### WW-Rechten en Uitkering
Voor [klant_man]:
- WW-rechten in maanden
- Uitkeringshoogte
- Inkomensterugval

Voor [klant_vrouw]:
- WW-rechten in maanden
- Uitkeringshoogte
- Inkomensterugval

### Impact op Woonlasten
- Analyse betaalbaarheid
- Beschikbare buffers
- Benodigde aanvullingen

### Risicobeperkende Maatregelen
- Opbouw financiële buffer
- Alternatieve inkomstenbronnen
- Uitgavenbeperking`,

  'adviesmotivatie aow': `
## Adviesmotivatie AOW

### Pensioensituatie
- AOW-datum [klant_man]: ...
- AOW-datum [klant_vrouw]: ...
- Opgebouwde pensioenrechten
- Verwacht pensioeninkomen

### Hypotheek bij Pensionering
- Resterende hypotheek: € ...
- Verwachte maandlast: € ...
- Aflossingsplan tot pensioen
- Betaalbaarheid na pensionering

### Aanvullende Maatregelen
- Extra aflossingen
- Opbouw vermogen
- Aanpassingen in uitgavenpatroon`,

  'adviesmotivatie overlijden': `
## Adviesmotivatie Overlijden

### Scenario Overlijden [klant_man]
- Inkomenssituatie [klant_vrouw]
- Nabestaandenpensioen
- Hypotheeklasten
- Benodigde aanvulling

### Scenario Overlijden [klant_vrouw]
- Inkomenssituatie [klant_man]
- Nabestaandenpensioen
- Hypotheeklasten
- Benodigde aanvulling

### Geadviseerde Oplossing
- ORV-dekking
- Premiehoogte
- Duur van de dekking
- Begunstiging`,

  'adviesmotivatie einde relatie': `
## Adviesmotivatie Einde Relatie

### Eigendomsverhoudingen
- Aandeel [klant_man]: ...%
- Aandeel [klant_vrouw]: ...%
- Verdeling hypotheeklasten
- Vastlegging in akte

### Individuele Draagkracht
Voor [klant_man]:
- Individueel inkomen
- Maximale hypotheeklast
- Overige lasten

Voor [klant_vrouw]:
- Individueel inkomen
- Maximale hypotheeklast
- Overige lasten

### Afspraken en Risico's
- Scenario bij scheiding
- Verdeling overwaarde
- Uitkoopmogelijkheden
- Verkoop woning`
};

export function createSectionPrompt(section: string, data: PromptData): string {
  const sectionKey = section.toLowerCase();
  const sectionInstruction = sectionInstructions[sectionKey] || `Genereer een professionele analyse voor de sectie "${section}"`;
  
  let prompt = basePrompt;
  prompt = prompt.replace('{transcript}', data.transcript || '');
  prompt = prompt.replace('{klantprofiel}', data.klantprofiel || 'Geen klantprofiel beschikbaar');
  
  prompt += `\n\nGEVRAAGDE SECTIE EN STRUCTUUR:\n${sectionInstruction}\n\nGenereer deze sectie in professioneel Nederlands met de juiste opmaak. Gebruik consistent [klant_man] en [klant_vrouw] voor de namen.`;
  
  return prompt;
}
