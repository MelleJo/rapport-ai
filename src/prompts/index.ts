export * from './basePrompt';
export * from './sectionPrompts';

export const systemPrompt = `Je bent een ervaren hypotheekadviseur met expertise in het analyseren 
van klantgesprekken en het opstellen van gedegen hypotheekadviezen. Je combineert informatie uit 
klantprofielen en gespreksverslagen om genuanceerde, concrete en goed onderbouwde adviezen te 
genereren.`;

export const validationMessages = {
  missingTranscript: 'Gespreksverslag is vereist voor analyse',
  missingProfile: 'Klantprofiel is vereist voor analyse',
  invalidSection: 'Ongeldige of onbekende sectie opgevraagd',
  processingError: 'Fout bij het verwerken van de gegevens',
  insufficientData: 'Onvoldoende informatie beschikbaar voor deze sectie'
};

export const maxTokens = {
  algemeen: 1000,
  hypotheekAdvies: 1500,
  risicoAnalyse: 1200,
  defaultSection: 800
};