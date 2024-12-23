export interface PersoonlijkeSituatie {
    leeftijd: string;
    samenwonenMetPartner: boolean;
    thuiswonendeKinderen: boolean;
    ondernemer: boolean;
  }
  
  export interface WoonSituatie {
    huidigeWoonsituatie: string;
    huidigeHypotheeklast: number;
    eerderKoopwoning: boolean;
    woonwens: string;
    eigenaren: string[];
    woningType: string;
    concreteWoning: boolean;
    postcode?: string;
    huisnummer?: string;
    maximaleHypotheeklast: number;
  }
  
  export interface FinancieleSituatie {
    nettoInkomenPerMaand: number;
    spaarBedragPerMaand: number;
    inkomensBerekening: string[];
    inkomensverwachting: string;
    toekomstveranderingen: {
      minderWerken: string;
      gezinsuitbreiding: string;
      erfenisSchenking: string;
      studiekostenKinderen: string;
      verhuizing: string;
    };
    andereRelevantieVerandering?: string;
    leningenVerplichtingen: string[];
    spaardoelen: string[];
    gespaard: number;
    eigenInbreng: number;
  }
  
  export interface HypotheekKennis {
    ervaring: string;
    bekendMetHypotheekvormen: {
      leven: string;
      lineair: string;
      beleggen: string;
      banksparen: string;
      annuiteiten: string;
      aflossingsvrij: string;
    };
    renteaftrekKennis: {
      leven: string;
      lineair: string;
      beleggen: string;
      banksparen: string;
      annuiteiten: string;
      aflossingsvrij: string;
    };
    lastenVoorkeur: string;
    hypotheekEigenschappen: string[];
    rentevastePeriodeWens: string;
    boeteVrijAflossen: string;
  }
  
  export interface Arbeidsongeschiktheid {
    bekendMetBegrippen: {
      aov: string;
      wia: string;
    };
    woonwens: string;
    inkomensdalingOpvang: string[];
    werkgeverRegeling: {
      eersteJaar: string;
      tweedeJaar: string;
    };
    werkgeverVoorzieningen: string[];
  }
  
  export interface Werkloosheid {
    bekendMetWW: string;
    woonwens: string;
    inkomensdalingOpvang: string[];
  }
  
  export interface AOW {
    bekendMetBegrippen: {
      pensioenregeling: string;
      lijfrente: string;
      aow: string;
    };
    woonwens: string;
    inkomensdalingOpvang: string;
  }
  
  export interface OverlijdenPartner {
    bekendMetBegrippen: {
      anw: string;
      orv: string;
    };
    woonwens: string;
    inkomensdalingOpvang: string[];
  }
  
  export interface EindeRelatie {
    woonwens: string;
    inkomensdalingOpvang: string[];
  }
  
  export interface WoningVerduurzamen {
    kennisEnergiebesparend: string;
    kennisFinanciering: string;
    energielabel: string;
    verduurzamenInteresse: string;
    bestaandeVoorzieningen: string[];
    energielastenWens: string;
  }
  
  export interface KlantProfiel {
    persoonlijkeSituatie: PersoonlijkeSituatie;
    woonSituatie: WoonSituatie;
    financieleSituatie: FinancieleSituatie;
    hypotheekKennis: HypotheekKennis;
    arbeidsongeschiktheid: Arbeidsongeschiktheid;
    werkloosheid: Werkloosheid;
    aow: AOW;
    overlijdenPartner: OverlijdenPartner;
    eindeRelatie: EindeRelatie;
    woningVerduurzamen: WoningVerduurzamen;
  }