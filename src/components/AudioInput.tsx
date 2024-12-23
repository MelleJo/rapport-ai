'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'

interface AudioInputProps {
  onTranscriptionComplete: (transcript: string) => void;
}

export default function AudioInput({ onTranscriptionComplete }: AudioInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setUploadError('Please upload an audio file');
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

      const data = await response.json();
      if (data.transcript) {
        onTranscriptionComplete(data.transcript);
      }
    } catch (error) {
      setUploadError('Error processing audio file');
      console.error('Error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold mb-4">Upload Audio Bestand</h2>
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

      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold mb-4">Of Neem Direct Op</h2>
        <AudioRecorder onTranscriptionComplete={onTranscriptionComplete} />
      </div>
    </div>
  );
}