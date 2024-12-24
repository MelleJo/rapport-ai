export const sectionPrompts = {
    algemeen: `
  Analyseer de algemene klantsituatie en genereer een samenvatting die de volgende aspecten behandelt:
  - Huidige woonsituatie en woonwensen
  - Financiële situatie (inkomen, vermogen, lasten)
  - Belangrijkste doelstellingen en wensen
  - Relevante persoonlijke omstandigheden
  
  Gebruik alleen concrete informatie uit het klantprofiel en transcript.
    `,
  
    verantwoordLenen: `
  Analyseer de leencapaciteit en betaalbaarheid, met focus op:
  - Huidige en toekomstige inkomsten
  - Vaste en variabele lasten
  - Toegestane financieringslast
  - Buffer en reserves
  - Specifieke risico's of aandachtspunten
  
  Gebruik alleen concrete cijfers en gegevens uit de beschikbare bronnen.
    `,
  
    hypotheekAdvies: `
  Onderbouw de hypotheekkeuzes met betrekking tot:
  - Gekozen hypotheekvorm(en)
  - Rentevaste periode
  - Concrete bedragen en voorwaarden
  - Specifieke productvoorkeuren
  - Risico's en aandachtspunten
  
  Baseer het advies uitsluitend op besproken voorkeuren en keuzes.
    `,
  
    overbrugging: `
  Analyseer de overbruggingssituatie:
  - Noodzaak en hoogte overbrugging
  - Onderbouwing van bedragen
  - Risico's en voorwaarden
  - Concrete afspraken en termijnen
  
  Gebruik alleen informatie die expliciet is besproken.
    `,
  
    arbeidsongeschiktheid: `
  Beoordeel de arbeidsongeschiktheidsrisico's:
  - Huidige inkomenssituatie
  - Werkgeversvoorzieningen
  - Gewenste aanvullende dekking
  - Concrete bedragen en voorwaarden
  - Impact op hypotheeklasten
  
  Focus op de specifieke situatie van de klant(en).
    `,
  
    werkloosheid: `
  Analyseer de werkloosheidsrisico's:
  - Huidige werksituatie
  - WW-rechten en -uitkering
  - Impact op hypotheeklasten
  - Gewenste bescherming
  - Concrete maatregelen
  
  Baseer het advies op de individuele situatie.
    `,
  
    aow: `
  Beoordeel de AOW-situatie:
  - AOW-leeftijd en planning
  - Pensioenopbouw
  - Impact op hypotheeklasten
  - Gewenste maatregelen
  - Concrete voorzieningen
  
  Gebruik alleen besproken informatie en plannen.
    `,
  
    overlijden: `
  Analyseer het overlijdensrisico:
  - Gewenste nabestaandendekking
  - Concrete verzekeringskeuzes
  - Voorgestelde dekking en voorwaarden
  - Specifieke wensen en eisen
  - Impact op nabestaanden
  
  Baseer het advies op expliciet besproken wensen.
    `,
  
    eindeRelatie: `
  Beoordeel de situatie bij relatiebeëindiging:
  - Eigendomsverhoudingen
  - Financiële afspraken
  - Concrete scenario's
  - Risico's en maatregelen
  - Impact op hypotheek
  
  Gebruik alleen feitelijke informatie uit de bronnen.
    `,
  };
  
  export const financialPlanningSections = {
    samenvatting: `
      Genereer een beknopte samenvatting van het financieel advies die de volgende elementen bevat:
      - Belangrijkste bevindingen
      - Kernpunten van het advies
      - Financiële doelstellingen
      - Belangrijkste aanbevelingen
    `,
    
    huidigeSituatie: `
      Analyseer de huidige financiële situatie met focus op:
      - Netto besteedbaar inkomen
      - Vaste lasten en uitgavenpatroon
      - Vermogenspositie
      - Financiële wensen en doelen
    `,
    
    pensioen: `
      Analyseer de pensioensituatie met aandacht voor:
      - Huidige pensioenopbouw
      - Verwacht pensioeninkomen
      - Pensioentekort
      - Aanvullende voorzieningen
    `,
    
    overlijden: `
      Beoordeel de financiële situatie bij overlijden:
      - Impact op nabestaanden
      - Bestaande voorzieningen
      - Tekorten en risico's
      - Aanbevolen maatregelen
    `,
    
    arbeidsongeschiktheid: `
      Analyseer de situatie bij arbeidsongeschiktheid:
      - Inkomensterugval
      - Bestaande dekkingen
      - Werkgeversvoorzieningen
      - Aanvullende behoeften
    `,
    
    ervenSchenken: `
      Adviseer over vermogensoverdracht:
      - Huidige situatie
      - Wensen en doelstellingen
      - Fiscale aspecten
      - Concrete aanbevelingen
    `
  };
  // Helper function to get specific section prompt
  export const getSectionPrompt = (section: keyof typeof sectionPrompts): string => {
    return sectionPrompts[section] || '';
  };