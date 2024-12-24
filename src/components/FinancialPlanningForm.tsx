import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import TranscriptInput from '@/components/TranscriptInput';
import FinancialPlanningReport from '@/components/FinancialPlanningReport';

export default function FinancialPlanningForm() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [missingInfo, setMissingInfo] = useState<string[]>([]);
  const [analysisData, setAnalysisData] = useState<{ 
    missingInformation: string[], 
    complete: boolean, 
    context?: string 
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInitialInput, setShowInitialInput] = useState(true);

  const generateReport = async (transcriptText: string) => {
    try {
      const response = await fetch('/api/generate-financial-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReport(data.report);
      setShowInitialInput(false);
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTranscription = async (transcriptText: string) => {
    setTranscript(transcriptText);
    setIsProcessing(true);
    setError(null);
    setMissingInfo([]);

    try {
      // First, analyze for missing information
      const analysisResponse = await fetch('/api/analyze-financial-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      const analysisData = await analysisResponse.json();
      setAnalysisData(analysisData);

      if (analysisData.missingInformation && analysisData.missingInformation.length > 0) {
        setMissingInfo(analysisData.missingInformation);
        setIsProcessing(false);
        return;
      }

      await generateReport(transcriptText);
    } catch (error) {
      console.error('Error analyzing transcript:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden');
      setIsProcessing(false);
    }
  };

  const handleAdditionalInfo = async (additionalTranscript: string) => {
    if (!transcript) return;

    const combinedTranscript = `${transcript}\n\nAanvullende informatie:\n${additionalTranscript}`;
    setTranscript(combinedTranscript);
    handleTranscription(combinedTranscript);
  };

  const handleSkip = async () => {
    if (!transcript) return;
    setIsProcessing(true);
    await generateReport(transcript);
    setMissingInfo([]);
  };

  return (
    <div className="space-y-6">
      {showInitialInput && !report && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Gespreksverslag Invoeren</h2>
          <TranscriptInput onTranscriptionComplete={handleTranscription} />
        </div>
      )}

      {missingInfo.length > 0 && (
        <div className="space-y-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">De volgende informatie ontbreekt nog:</p>
                <ul className="list-disc pl-4">
                  {missingInfo.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                {analysisData?.context && (
                  <p className="mt-2 text-sm text-gray-600 italic">
                    {analysisData.context}
                  </p>
                )}
              </div>
            </AlertDescription>
          </Alert>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Aanvullende Informatie</h2>
              <Button 
                onClick={handleSkip}
                variant="outline"
                className="text-gray-600 hover:text-gray-800"
              >
                Overslaan en Doorgaan
              </Button>
            </div>
            <TranscriptInput onTranscriptionComplete={handleAdditionalInfo} />
          </div>
        </div>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Rapport genereren...</p>
        </div>
      )}

      {report && (
        <div className="mt-8">
          <FinancialPlanningReport report={report} />
        </div>
      )}
    </div>
  );
}
