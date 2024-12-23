'use client'

import { useState } from 'react';
import NameReplacer from './NameReplacer';

interface Section {
  title: string;
  content: string;
}

interface AdviceReportProps {
  sections: Section[];
}

export default function AdviceReport({ sections: initialSections }: AdviceReportProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Adviesrapport</h2>
        <div className="space-x-4">
          <NameReplacer 
            sections={sections} 
            onReplace={setSections} 
          />
          <button
            onClick={() => copyToClipboard(sections.map(s => `${s.title}\n\n${s.content}\n\n`).join(''))}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Kopieer Volledig Rapport
          </button>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {section.title}
            </h3>
            <button
              onClick={() => copyToClipboard(section.content)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 
                       border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Kopieer Sectie
            </button>
          </div>
          <div className="prose max-w-none">
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <div className="whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}