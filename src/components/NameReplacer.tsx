'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { Section } from 'types/Section';
import Dialog from 'components/ui/dialog';

interface NameReplacerProps {
  sections: Section[];
  onReplace: Dispatch<SetStateAction<Section[]>>;
}

interface NameMapping {
  placeholder: string;
  name: string;
}

export default function NameReplacer({ sections, onReplace }: NameReplacerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInputs, setNameInputs] = useState<NameMapping[]>([
    { placeholder: '[klant_man]', name: '' },
    { placeholder: '[klant_vrouw]', name: '' }
  ]);

  const findUniquePlaceholders = (content: string): string[] => {
    const regex = /\[klant_[^\]]+\]/g;
    const matches = content.match(regex) || [];
    return [...new Set(matches)];
  };

  const handleOpen = () => {
    // Find all unique placeholders in the content
    const allPlaceholders = sections.flatMap(section => 
      findUniquePlaceholders(section.content)
    );
    const uniquePlaceholders = [...new Set(allPlaceholders)];
    
    setNameInputs(uniquePlaceholders.map(placeholder => ({
      placeholder,
      name: ''
    })));
    setIsOpen(true);
  };

  const handleReplace = () => {
    const updatedSections = sections.map(section => {
      let newContent = section.content;
      nameInputs.forEach(({ placeholder, name }) => {
        if (name) {
          // Use regex to replace all occurrences
          const regex = new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g');
          newContent = newContent.replace(regex, name);
        }
      });
      return {
        ...section,
        content: newContent
      };
    });

    onReplace(updatedSections);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white 
                   rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500"
      >
        Namen Invullen
      </button>

      <Dialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="Vul de namen in"
      >
        <div className="space-y-4">
          {nameInputs.map((input, index) => (
            <div key={index} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {input.placeholder}:
              </label>
              <input
                type="text"
                value={input.name}
                onChange={(e) => {
                  const newInputs = [...nameInputs];
                  newInputs[index].name = e.target.value;
                  setNameInputs(newInputs);
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md 
                     hover:bg-gray-200"
          >
            Annuleren
          </button>
          <button
            onClick={handleReplace}
            className="px-4 py-2 bg-blue-600 text-white rounded-md 
                     hover:bg-blue-700"
          >
            Namen Vervangen
          </button>
        </div>
      </Dialog>
    </>
  );
}
