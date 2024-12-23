'use client'

import { useState, useRef, useEffect } from 'react'
import RecordRTC from 'recordrtc'

interface AudioRecorderProps {
  onTranscriptionComplete: (transcript: string) => void;
}

export default function AudioRecorder({ onTranscriptionComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup function for audio URL
  useEffect(() => {
    return () => {
      if (audioUrl && typeof URL !== 'undefined') {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC,
      });
      
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        // Only create URL if available
        if (typeof URL !== 'undefined') {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
        setIsRecording(false);
        // Stop all tracks in the stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        processAudio(blob);
      });
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      // Create a File object from the Blob
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
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Opname
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span>Bezig met transcriberen...</span>
        </div>
      )}
    </div>
  );
}
