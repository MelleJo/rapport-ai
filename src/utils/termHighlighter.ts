// List of financial terms that can be explained
export const financialTerms = [
    'annuïteitenhypotheek',
    'lineaire hypotheek',
    'aflossingsvrije hypotheek',
    'nationale hypotheek garantie',
    'overbruggingskrediet',
    'overlijdensrisicoverzekering',
    'arbeidsongeschiktheidsverzekering',
    'woonlastenverzekering',
    'rentevaste periode',
    'boeterente',
    'loan to value',
    'box 1',
    'box 3',
    'eigenwoningforfait',
    'overdrachtsbelasting',
    'kapitaalverzekering eigen woning',
    'restschuld',
    'provisieloos advies',
    'execution only',
    'bankgarantie',
    'taxatierapport',
    'bouwkundige keuring',
    'erfpacht',
    'vereniging van eigenaren',
    'kadaster',
    'hypotheekakte',
    'overbruggingshypotheek',
    'tweede hypotheek',
    'onderpand',
    'hypotheekrenteaftrek',
    'kosten koper',
    'makelaarskosten',
    'notariskosten',
    'advieskosten',
    'aflossingsvorm',
    'bindende offerte',
    'voorlopige offerte',
    'bouwdepot',
    'eigenwoningreserve',
    'hypotheekbedrag',
    'marktwaarde',
    'onderhoudsstaat',
    'overdrachtsakte',
    'roerende zaken',
    'starterslening',
    'taxatiewaarde',
    'verduurzaming',
    'vermogensrendementsheffing',
    'woningwaarde',
    'zelfstandig ondernemer',
  ];
  
  // Function to identify financial terms in a text
  export const identifyTerms = (text: string): string[] => {
    return financialTerms.filter(term => 
      text.toLowerCase().includes(term.toLowerCase())
    );
  };
  
  // Function to wrap identified terms with a component
  export const wrapTermsWithComponent = (
    text: string, 
    terms: string[],
    componentGenerator: (term: string, content: string) => string
  ): string => {
    let result = text;
    
    // Sort terms by length (descending) to handle overlapping terms correctly
    const sortedTerms = terms.sort((a, b) => b.length - a.length);
    
    for (const term of sortedTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      result = result.replace(regex, componentGenerator(term, text));
    }
    
    return result;
  };