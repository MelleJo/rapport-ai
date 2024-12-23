'use client'

import { useState } from 'react'
import AudioInput from '@/components/AudioInput'
import AdviceReport from '@/components/AdviceReport'

interface Section {
  title: string;
  content: string;
}

export default function HypotheekPage() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscription = async (transcriptText: string) => {
    setTranscript(transcriptText);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcript: transcriptText,
          // Note: klantprofiel will be handled separately if needed
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setSections(data.sections);
    } catch (error) {
      console.error('Error generating sections:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hypotheekadvies Generator</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <AudioInput onTranscriptionComplete={handleTranscription} />
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Adviesrapport genereren...</p>
          </div>
        )}

        {sections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Gegenereerd Adviesrapport</h2>
            <AdviceReport sections={sections} />
          </div>
        )}
      </div>
    </div>
  );
}