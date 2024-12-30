// src/stores/useCustomerStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { KlantProfiel } from '@/types/klantProfiel';

interface CustomerState {
  profile: KlantProfiel | null;
  malePartner: string;
  femalePartner: string;
  setProfile: (profile: KlantProfiel | null) => void;
  setPartnerNames: (male: string, female: string) => void;
  reset: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      profile: null,
      malePartner: '[klant_man]',
      femalePartner: '[klant_vrouw]',
      setProfile: (profile) => set({ profile }),
      setPartnerNames: (male, female) => set({ malePartner: male, femalePartner: female }),
      reset: () => set({ 
        profile: null, 
        malePartner: '[klant_man]', 
        femalePartner: '[klant_vrouw]' 
      }),
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);