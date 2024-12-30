// src/components/NameReplacer.tsx
'use client'

import { useState } from 'react';
import Dialog from './ui/dialog';

interface NameReplacerProps {
  onReplace: (malePartner: string, femalePartner: string) => void;
}

export default function NameReplacer({ onReplace }: NameReplacerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [malePartner, setMalePartner] = useState('');
  const [femalePartner, setFemalePartner] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReplace(malePartner, femalePartner);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 
                 border border-blue-300 rounded-md hover:bg-blue-50"
      >
        Namen Invullen
      </button>

      <Dialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Namen Invullen"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mannelijke Partner ([klant_man])
            </label>
            <input
              type="text"
              value={malePartner}
              onChange={(e) => setMalePartner(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
              placeholder="Voer naam in"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vrouwelijke Partner ([klant_vrouw])
            </label>
            <input
              type="text"
              value={femalePartner}
              onChange={(e) => setFemalePartner(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
              placeholder="Voer naam in"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                       rounded-md hover:bg-gray-200"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                       rounded-md hover:bg-blue-700"
            >
              Toepassen
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}