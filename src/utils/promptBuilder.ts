import { basePrompt } from '../prompts/basePrompt';

interface PromptData {
  klantprofiel: string;
  transcript: string;
}

export const buildPrompt = (data: PromptData): string => {
  return basePrompt
    .replace('{klantprofiel}', data.klantprofiel)
    .replace('{transcript}', data.transcript);
};

export const parseKlantProfiel = async (fileContent: string) => {
  // Parse the klantprofiel PDF content and extract structured data
  // This will depend on how you receive the PDF content
  return fileContent;
};

export const createSectionPrompt = (section: string, data: PromptData): string => {
  const prompt = buildPrompt(data);
  return `${prompt}

GEVRAAGDE SECTIE: ${section}

Genereer alleen de inhoud voor de sectie "${section}". 
Gebruik hierbij alle relevante informatie uit zowel het klantprofiel als het transcript.
Focus specifiek op de aspecten die relevant zijn voor deze sectie.`;
};