import { create } from 'zustand';

interface AppState {
  activeModule: 'hypotheek' | 'financieel' | 'pensioen' | null;
  setActiveModule: (module: 'hypotheek' | 'financieel' | 'pensioen' | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: null,
  setActiveModule: (module) => set({ activeModule: module }),
}));