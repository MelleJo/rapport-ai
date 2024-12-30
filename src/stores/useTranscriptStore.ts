// src/stores/useTranscriptStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ProcessedTranscript } from '@/types/Transcript';

interface TranscriptState {
  transcript: string | null;
  processedTranscript: ProcessedTranscript | null;
  isProcessing: boolean;
  error: string | null;
  setTranscript: (transcript: string | null) => void;
  setProcessedTranscript: (processed: ProcessedTranscript | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTranscriptStore = create<TranscriptState>()(
  persist(
    (set) => ({
      transcript: null,
      processedTranscript: null,
      isProcessing: false,
      error: null,
      setTranscript: (transcript) => set({ transcript }),
      setProcessedTranscript: (processed) => set({ processedTranscript: processed }),
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      setError: (error) => set({ error }),
      reset: () => set({ 
        transcript: null, 
        processedTranscript: null, 
        isProcessing: false, 
        error: null 
      }),
    }),
    {
      name: 'transcript-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);