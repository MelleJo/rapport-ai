'use client'

import { useState } from 'react'
import { Pencil, Loader2, Sparkles } from 'lucide-react'

interface BlockEditorProps {
  content: string;
  onUpdate: (newContent: string) => void;
  title: string;
}

export default function BlockEditor({ content, onUpdate, title }: BlockEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/enhance-section', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          instruction,
          title,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance content');
      }

      const data = await response.json();
      onUpdate(data.enhancedContent);
      setInstruction('');
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    'Maak dit onderdeel uitgebreider',
    'Maak dit onderdeel beknopter',
    'Voeg meer details toe over risico\'s',
    'Voeg specifieke bedragen toe',
    'Leg dit in simpelere taal uit',
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-lg 
                 hover:bg-gray-50 transition-all duration-200 border border-gray-200
                 group"
        title="Bewerk deze sectie"
      >
        <Pencil className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
      </button>

      {isOpen && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="text"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder="Wat wil je aanpassen aan deze sectie?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInstruction(suggestion)}
                  className="text-sm px-3 py-1 bg-white border border-gray-200 
                           rounded-full hover:bg-blue-50 hover:text-blue-600
                           hover:border-blue-200 transition-colors duration-150"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Annuleren
              </button>
              <button
                type="submit"
                disabled={isLoading || !instruction.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md
                         hover:bg-blue-700 disabled:bg-blue-300 
                         disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Bezig...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Verbeter Sectie</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}