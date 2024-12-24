'use client'

import { useState } from 'react';
import NameReplacer from './NameReplacer';
import BlockEditor from './BlockEditor';
import DownloadButton from './ui/DownloadButton';

interface Section {
  title: string;
  content: string;
}

interface AdviceReportProps {
  sections: Section[];
}

const replaceNames = (content: string, malePartner: string, femalePartner: string): string => {
  return content
    .replace(/\[klant_man\]/g, malePartner)
    .replace(/\[klant_vrouw\]/g, femalePartner);
};

const formatContent = (content: string): string => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/€(\d+([.,]\d+)?)/g, '€ $1')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br />');
};

export default function AdviceReport({ sections: initialSections }: AdviceReportProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);

  const handleNameReplace = (male: string, female: string) => {
    const updatedSections = sections.map(section => ({
      ...section,
      content: replaceNames(section.content, male, female)
    }));
    setSections(updatedSections);
  };

  const copyToClipboard = async (text: string) => {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      await navigator.clipboard.writeText(tempDiv.textContent || tempDiv.innerText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSectionUpdate = (index: number, newContent: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = {
      ...sections[index],
      content: newContent
    };
    setSections(updatedSections);
  };

  // Format the report data for the download
  const getReportData = () => {
    return {
      title: 'Hypotheekadvies Rapport',
      samenvatting: sections[0]?.content || '',  // Assuming first section is summary
      sections: sections.slice(1).map(section => ({
        title: section.title,
        content: section.content
      }))
    };
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Adviesrapport</h2>
        <div className="flex space-x-4">
          <NameReplacer onReplace={handleNameReplace} />
          <DownloadButton 
            report={getReportData()} 
            type="hypotheek"
          />
          <button
            onClick={() => copyToClipboard(sections.map(s => s.content).join('\n\n'))}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 
                     border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Kopieer Volledig Rapport
          </button>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              {section.title}
            </h3>
            <button
              onClick={() => copyToClipboard(section.content)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 
                       border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Kopieer Sectie
            </button>
          </div>

          <div className="prose max-w-none relative">
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: `<p>${formatContent(section.content)}</p>` 
                }}
                className="text-gray-800 space-y-4"
              />
            </div>
            <BlockEditor
              content={section.content}
              title={section.title}
              onUpdate={(newContent) => handleSectionUpdate(index, newContent)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}