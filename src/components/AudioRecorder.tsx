'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import RecordRTC with no SSR
const RecordRTC = dynamic(() => import('recordrtc'), {
  ssr: false,
});

interface AudioRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
}

export default function AudioRecorder({ onTranscriptionComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up function to stop tracks and revoke URLs
  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioUrl && typeof window !== 'undefined') {
      URL.revokeObjectURL(audioUrl);
    }
  };

  useEffect(() => {
    return cleanup;
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
        throw new Error('Media devices not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
      });
      
      recorderRef.current = recorder;
      recorder.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      alert('Could not start recording. Please make sure you have granted microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const blob = recorderRef.current.getBlob();
      if (typeof window !== 'undefined') {
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      }
      setIsRecording(false);
      cleanup();
      processAudio(blob);
    });
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      const file = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
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
        throw new Error('No transcript received');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Er is een fout opgetreden bij het verwerken van de audio. Probeer het opnieuw.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Opname
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Stop Opname
          </button>
        )}
      </div>

      {audioUrl && (
        <div className="mt-4">
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Bezig met transcriberen...</span>
        </div>
      )}
    </div>
  );
}