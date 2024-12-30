import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, ArrowLeft, FileText, Mic, Upload } from 'lucide-react';
import TranscriptInput from './TranscriptInput';
import AdviceReport from './AdviceReport';
import type { Section } from '@/types/Section';

const steps = [
  {
    title: "Gesprek Invoeren",
    description: "Voer het adviesgesprek in via tekst, audio of upload"
  },
  {
    title: "Rapport Genereren",
    description: "Het systeem genereert het adviesrapport"
  },
  {
    title: "Rapport Aanpassen",
    description: "Pas het gegenereerde rapport aan indien nodig"
  }
];

export default function HypotheekWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranscription = async (transcriptText: string) => {
    setTranscript(transcriptText);
    setIsProcessing(true);
    setError(null);
    setCurrentStep(1); // Move to processing step

    try {
      const response = await fetch('/api/generate-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          transcript: transcriptText,
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
      setCurrentStep(2); // Move to report step
    } catch (error) {
      console.error('Error generating sections:', error);
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden');
      setCurrentStep(0); // Return to input step on error
    } finally {
      setIsProcessing(false);
    }
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
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-lg text-gray-600">Adviesrapport genereren...</p>
            <p className="mt-2 text-sm text-gray-500">Dit kan enkele momenten duren</p>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AdviceReport sections={sections} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hypotheekadvies Generator</h1>
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