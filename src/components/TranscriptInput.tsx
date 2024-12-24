'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'

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
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold mb-4">Optie 1: Type of Plak Tekst</h2>
        <form onSubmit={handleTextSubmit} className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Plak hier het gespreksverslag..."
            className="w-full h-32 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                     disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Verwerk Tekst
          </button>
        </form>
      </div>

      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold mb-4">Optie 2: Upload Audio Bestand</h2>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {isUploading && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Bestand uploaden en transcriberen...
          </div>
        )}
        {uploadError && (
          <div className="mt-2 text-sm text-red-600">
            {uploadError}
          </div>
        )}
      </div>

      <div className="pb-4">
        <h2 className="text-lg font-semibold mb-4">Optie 3: Neem Direct Op</h2>
        <AudioRecorder onTranscriptionComplete={onTranscriptionComplete} />
      </div>
    </div>
  );
}