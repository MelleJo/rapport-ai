import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import TranscriptInput from './TranscriptInput';
import FinancialPlanningReport from './FinancialPlanningReport';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AnalysisResult {
  missingInformation: string[];
  complete: boolean;
  context?: string;
}

const steps = [
  {
    title: "Gesprek invoeren",
    description: "Voer het adviesgesprek in via tekst, audio of upload"
  },
  {
    title: "Informatie Aanvullen",
    description: "AI stelt aanvullende vragen om ontbrekende gegevens op te halen"
  },
  {
    title: "Rapport analyseren",
    description: "Het systeem analyseert de benodigde informatie"
  },
  {
    title: "Rapport genereren",
    description: "Het systeem genereert het adviesrapport"
  },
  {
    title: "Rapport aanpassen",
    description: "Pas het gegenereerde rapport aan indien nodig"
  }
];

export default function FinancialWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscription = async (transcriptText: string) => {
    setTranscript(transcriptText);
    setIsProcessing(true);
    setError(null);
    setCurrentStep(1);

    try {
      const response = await fetch('/api/analyze-financial-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      const data = await response.json();
      setAnalysisData(data);

      if (data.missingInformation.length > 0) {
        setCurrentStep(1); // Stay in "Informatie Aanvullen" step
        setIsProcessing(false);
        return;
      }

      setCurrentStep(2); // Move to "Rapport analyseren"
      await generateReport(transcriptText);
    } catch (err) {
      setError('Fout bij het analyseren van het gespreksverslag.');
      setCurrentStep(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReport = async (transcriptText: string) => {
    try {
      const response = await fetch('/api/generate-financial-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      const data = await response.json();
      setReport(data.report);
      setCurrentStep(3); // Move to "Rapport genereren"
    } catch (err) {
      setError('Fout bij het genereren van het rapport.');
      setCurrentStep(0);
    }
  };

  const handleAdditionalInfo = async (additionalText: string) => {
    if (!transcript) return;
    const updatedTranscript = `${transcript}\n\nAanvullende informatie:\n${additionalText}`;
    setTranscript(updatedTranscript);
    await handleTranscription(updatedTranscript);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TranscriptInput onTranscriptionComplete={handleTranscription} />;
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {analysisData?.missingInformation && analysisData.missingInformation.length > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {analysisData.missingInformation.map((info, idx) => (
                      <li key={idx}>{info}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <TranscriptInput onTranscriptionComplete={handleAdditionalInfo} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p>Rapport genereren...</p>
          </motion.div>
        );
      case 3:
        return report && <FinancialPlanningReport report={report} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Financieel Advies Generator</h1>
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <div className={`w-8 h-8 rounded-full border-2 ${index <= currentStep ? 'border-blue-600' : 'border-gray-300'}`}>
                <span>{index + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardContent>
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
