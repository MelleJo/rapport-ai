export const standardTexts = {
    nbi: {
      algemeen: `We maken in dit rapport gebruik van de term 'resterend budget'. Daarmee bedoelen we het geldbedrag dat over blijft wanneer alle lasten zijn betaald. Sommige lasten (zoals inkomstenbelasting en de hypotheeklasten) worden al door ons berekend. Andere lasten moeten worden geschat, zoals uw uitgaven voor levensonderhoud. Denk aan boodschappen, gemeentelijke belastingen, gas, water en licht, kapper, tandartskosten, etc.`,
      zonderUitgaven: `In uw geval hebben we geen rekening gehouden met de uitgaven voor levensonderhoud. Dat betekent dat u het bedrag aan resterend budget moet gebruiken om onder meer uw boodschappen en andere vaste lasten van te betalen.`,
      metUitgaven: `Wij hebben van u een overzicht ontvangen van alle uitgaven. Op basis van dit overzicht hebben wij een resterend budget van € [BEDRAG] per jaar vastgesteld.`,
      sparenOntsparen: `In dit overzicht is de mogelijkheid van sparen/ontsparen opgenomen. Dit wil zeggen dat bij een tekort aan inkomen op basis van het gewenste resterende budget het spaargeld wordt gebruikt om het inkomen aan te vullen. Dit werkt echter ook andersom; er wordt geld toegevoegd aan het spaargeld wanneer het resterend budget hoger is dan het gewenste bedrag.`
    },
    pensioen: {
      voldoende: `Wanneer u met pensioen gaat daalt het resterend budget naar circa € [BEDRAG] netto per jaar. Dit is het resterend budget na het betalen van de hypotheek en [LASTEN]. Dit komt neer op een maandelijks netto budget van circa € [BEDRAG_MAAND] om alle overige vaste lasten van te betalen evenals alle andere uitgaven voor levensonderhoud.`,
      onvoldoende: `Gedurende de jaren dat u beiden werkt, kunt u ruimschoots over het benodigd resterend budget beschikken. Wanneer u echter de AOW leeftijd bereikt, daalt het resterend budget naar circa € [BEDRAG] per jaar (€ [BEDRAG_MAAND] per maand).`,
      zelfstandige: `Uw huidige pensioensituatie vraagt om extra aandacht. Als zelfstandig ondernemer bouwt u geen pensioen op. Gelukkig zijn er mogelijkheden om zelf pensioen op te bouwen, bijvoorbeeld door middel van een lijfrente.`
    },
    overlijden: {
      voldoende: `We hebben het overlijdensscenario besproken en we hebben samen de conclusie getrokken dat u over voldoende inkomen/vermogen beschikt om uw huidige levensstandaard te behouden wanneer u/uw partner onverhoopt komt te overlijden.`,
      voldoendeVermogen: `Met de uitkering van de huidige overlijdensrisicoverzekering en het aanwezige spaargeld, kunt u tot uw [LEEFTIJD]e blijven beschikken over het gewenst budget.`,
      tekortMetAdvies: `Op dit moment zijn de huidige voorzieningen niet voldoende om uw huidige levensstandaard te behouden wanneer u/uw partner onverhoopt komt te overlijden. Gelukkig zijn er mogelijkheden om dit tekort op te vangen door middel van een overlijdensrisicoverzekering.`,
      adviesMotivatie: `In het overlijdensscenario hebben wij het gewenste netto besteedbaar inkomen verlaagd naar € [BEDRAG] per jaar. Halveren is niet reëel omdat er behoorlijk wat vaste lasten gewoon doorlopen. Wel vallen er dan persoonlijke kosten als kleding, voedsel en de premie voor een ziektekostenverzekering weg.`
    },
    arbeidsongeschiktheid: {
      zelfstandigeVoldoende: `Wanneer dhr./mw. [NAAM] volledig arbeidsongeschikt raakt, komt de arbeidsongeschiktheidsverzekering bij verzekeraar [VERZEKERAAR] tot uitkering. Samen met het inkomen van [PARTNER], kan over het gewenst resterend budget worden beschikt.`,
      loonsdienstVoldoende: `We hebben uw arbeidsongeschiktheidsscenario besproken en we hebben samen de conclusie getrokken dat het inkomen tot uw AOW leeftijd voldoende zal zijn om uw huidige levensstandaard te behouden.`,
      wlvAdvies: `Wanneer u arbeidsongeschikt raakt, heeft dit grote gevolgen voor uw inkomen. Daarom adviseren wij u om een woonlastenverzekering af te sluiten op basis van de volgende uitgangspunten:`
    },
    werkloosheid: {
      zelfstandige: `Wanneer dhr./mw. [NAAM] geen nieuwe opdrachten meer weet binnen te halen en hierdoor "werkloos" raakt (niet meer als ondernemer werkzaam is), heeft dit grote consequenties voor het resterend budget. Deze zal dan dalen naar circa netto € [BEDRAG] per jaar (€ [BEDRAG_MAAND] per maand). Als ondernemer kunt u zich niet verzekeren tegen dit risico.`,
      loonsdienstVoldoende: `Wanneer dhr./mw. [NAAM] werkloos raakt, heeft dit grote consequenties voor het resterend budget. Echter, uw partner beschikt over een zodanig inkomen dat u desondanks over het gewenst resterend budget kunt blijven beschikken.`,
      geenOplossing: `Het risico van werkloosheid is uitsluitend voor 2 jaar mee te verzekeren op een woonlastenverzekering. In uw situatie ontstaat het tekort pas na 2 jaar. Hierdoor is er verzekeringstechnisch geen oplossing voor dit scenario.`
    }
  };
  
  // Helper function to replace placeholders in standard texts
  export const replacePlaceholders = (text: string, replacements: Record<string, string>) => {
    let result = text;
    Object.entries(replacements).forEach(([key, value]) => {
      result = result.replace(`[${key}]`, value);
    });
    return result;
  };
  
  // Helper function to select appropriate text based on situation
  export const selectStandardText = (category: keyof typeof standardTexts, situation: string, replacements?: Record<string, string>) => {
    const texts = standardTexts[category];
    const selectedText = texts[situation as keyof typeof texts];
    
    if (!selectedText) return '';
    
    return replacements ? replacePlaceholders(selectedText, replacements) : selectedText;
  };