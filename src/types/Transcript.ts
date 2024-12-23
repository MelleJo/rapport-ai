export interface TranscriptMetadata {
    timestamp: string;
    adviseur: string;
    klanten: string[];
    duur: string;
  }
  
  export interface TranscriptSegment {
    spreker: string;
    tekst: string;
    timestamp: string;
  }
  
  export interface Transcript {
    metadata: TranscriptMetadata;
    segments: TranscriptSegment[];
    rawText: string;  // Complete transcript text without segments
  }
  
  export interface ProcessedTranscript {
    transcript: Transcript;
    keyPoints: {
      hypotheek?: {
        gewenstBedrag?: number;
        rentevastePeriode?: string;
        hypotheekvorm?: string;
        maandlasten?: number;
      };
      risicos?: {
        arbeidsongeschiktheid?: string[];
        werkloosheid?: string[];
        overlijden?: string[];
        aow?: string[];
        eindeRelatie?: string[];
      };
      woonwensen?: string[];
      verduurzaming?: string[];
    };
  }