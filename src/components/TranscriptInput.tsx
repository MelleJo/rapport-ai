import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from './ui/textarea';
import { FileText, Upload, Mic } from 'lucide-react';
import AudioRecorder from './AudioRecorder';

interface TranscriptInputProps {
  onTranscriptionComplete: (transcript: string) => void;
}

export default function TranscriptInput({ onTranscriptionComplete }: TranscriptInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setUploadError('Upload alstublieft een audiobestand');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.transcript) {
        onTranscriptionComplete(data.transcript);
      } else {
        throw new Error('Geen transcriptie ontvangen');
      }
    } catch (error) {
      setUploadError('Fout bij het verwerken van het audiobestand');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      onTranscriptionComplete(textInput.trim());
      setTextInput('');
    }
  };

  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-2xl mx-auto mb-6">
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Type of plak tekst</span>
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Upload audio</span>
        </TabsTrigger>
        <TabsTrigger value="record" className="flex items-center gap-2">
          <Mic className="w-4 h-4" />
          <span>Neem direct op</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="text">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <Textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Plak hier het gespreksverslag..."
                  className="min-h-[200px] p-4 text-base"
                />
                <Button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="w-full sm:w-auto"
                >
                  Verwerk tekst
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="audio-upload"
                />
                <label 
                  htmlFor="audio-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-900">
                    Upload een audiobestand
                  </span>
                  <span className="text-sm text-gray-500 mt-1">
                    Sleep een bestand hierheen of klik om te uploaden
                  </span>
                </label>
              </div>

              {isUploading && (
                <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Bestand uploaden en transcriberen...
                </div>
              )}

              {uploadError && (
                <div className="mt-4 text-sm text-red-600 text-center">
                  {uploadError}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="record">
          <Card>
            <CardContent className="pt-6">
              <AudioRecorder onTranscriptionComplete={onTranscriptionComplete} />
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
