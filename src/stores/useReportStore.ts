// src/stores/useReportStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Section } from '@/types/Section';

interface ReportState {
  sections: Section[];
  isGenerating: boolean;
  error: string | null;
  setSections: (sections: Section[]) => void;
  updateSection: (index: number, content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      sections: [],
      isGenerating: false,
      error: null,
      setSections: (sections) => set({ sections }),
      updateSection: (index, content) => 
        set((state) => ({
          sections: state.sections.map((section, i) => 
            i === index ? { ...section, content } : section
          )
        })),
      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      reset: () => set({ sections: [], isGenerating: false, error: null }),
    }),
    {
      name: 'report-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
