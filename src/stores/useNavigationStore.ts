// src/stores/useNavigationStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NavigationState {
  previousPath: string | null;
  currentPath: string | null;
  setPreviousPath: (path: string) => void;
  setCurrentPath: (path: string) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      previousPath: null,
      currentPath: null,
      setPreviousPath: (path) => set({ previousPath: path }),
      setCurrentPath: (path) => set((state) => ({
        previousPath: state.currentPath,
        currentPath: path,
      })),
    }),
    {
      name: 'navigation-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);