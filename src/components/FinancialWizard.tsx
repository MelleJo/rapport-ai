import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ArrowLeft, FileText, Mic, Upload } from 'lucide-react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

const handleTranscription = async (transcriptText: string) => {
  console.log('Transcription started with:', transcriptText);
    console.log('Setting transcript:', transcriptText);
    setTranscript(transcriptText);
    setIsProcessing(true);
    setError(null);
    setCurrentStep(1); // Move to analysis step

    try {
      // First, analyze for missing information
      console.log('Analyzing transcript...');
      const analysisResponse = await fetch('/api/analyze-financial-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      const analysisData = await analysisResponse.json();
      console.log('Analysis result:', analysisData);
      setAnalysisData(analysisData);

      // Commenting out the check for missing information to proceed with report generation
      // if (analysisData.missingInformation && analysisData.missingInformation.length > 0) {
      //   setCurrentStep(1); // Stay on analysis step
      //   return;
      // }

      setCurrentStep(2); // Move to generation step

      // Generate the report
      console.log('Generating report...');
      const response = await fetch('/api/generate-financial-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: transcriptText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      console.log('Generated report:', data);
      setReport(data.report);
      setCurrentStep(3); // Move to report step
    } catch (error) {
      console.error('Error during transcription:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden');
      setCurrentStep(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdditionalInfo = async (additionalTranscript: string) => {
    if (!transcript) return;
    const combinedTranscript = `${transcript}\n\nAanvullende informatie:\n${additionalTranscript}`;
    setTranscript(combinedTranscript);
    handleTranscription(combinedTranscript);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TranscriptInput onTranscriptionComplete={handleTranscription} />
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {analysisData?.missingInformation && analysisData.missingInformation.length > 0 && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">De volgende informatie ontbreekt nog:</p>
                    <ul className="list-disc pl-4">
                      {analysisData.missingInformation.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    {analysisData.context && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        {analysisData.context}
                      </p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Aanvullende informatie</h3>
                  <TranscriptInput onTranscriptionComplete={handleAdditionalInfo} />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleTranscription(transcript || '')}
                    >
                      Doorgaan zonder aanvulling
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600">Financieel adviesrapport genereren...</p>
            <p className="mt-2 text-sm text-gray-500">Dit kan enkele momenten duren</p>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FinancialPlanningReport report={report} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Financieel advies generator</h1>
        <div className="flex justify-between items-center mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex-1">
              <div className="relative flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                              ${index <= currentStep ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  ) : (
                    <span className={`text-sm ${index === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
              <div className="mt-2">
                <h3 className={`text-sm font-medium ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 text-red-700 rounded-md"
            >
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
