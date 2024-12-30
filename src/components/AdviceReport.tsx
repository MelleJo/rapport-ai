'use client'

import React, { useEffect, useState } from 'react';
import BlockEditor from './BlockEditor';
import DownloadButton from '@/components/ui/DownloadButton';
import type { Section } from '@/types/Section';
import { useReportStore } from '@/stores/useReportStore';
import { useCustomerStore } from '@/stores/useCustomerStore';
import { Card, CardContent } from '@/components/ui/card';
import ExplanatoryTerm from './ExplanatoryTerm';
import { identifyTerms } from '@/utils/termHighlighter';

interface AdviceReportProps {
  sections: Section[];
}

const formatContent = (content: string): string => {
  let formatted = content;
  const blocks = formatted.split('\n\n');
  
  return blocks.map(block => {
    const lines = block.split('\n');
    
    // Handle bullet point lists
    if (lines.every(line => line.trim().startsWith('- ') || !line.trim())) {
      const items = lines
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.trim().substring(2));
      return `<ul class="list-disc pl-5 space-y-2 mb-4">${
        items.map(item => `<li class="text-gray-700">${
          formatInlineElements(item)
        }</li>`).join('')
      }</ul>`;
    }
    
    // Handle numbered lists
    if (lines.every(line => /^\d+\.\s/.test(line.trim()) || !line.trim())) {
      const items = lines
        .filter(line => /^\d+\.\s/.test(line.trim()))
        .map(line => line.trim().replace(/^\d+\.\s/, ''));
      return `<ol class="list-decimal pl-5 space-y-2 mb-4">${
        items.map(item => `<li class="text-gray-700">${
          formatInlineElements(item)
        }</li>`).join('')
      }</ol>`;
    }
    
    // Regular paragraphs
    return `<p class="text-gray-700 mb-4 last:mb-0">${
      formatInlineElements(block)
    }</p>`;
  }).join('');
};

const formatInlineElements = (text: string): string => {
  let formatted = text;
  
  // Format bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Format italic text
  formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
  
  // Format currency values
  formatted = formatted.replace(/€(\d+([.,]\d+)?)/g, '<span class="text-gray-900 font-medium">€ $1</span>');
  
  // Format percentages
  formatted = formatted.replace(/(\d+)%/g, '<span class="text-gray-900 font-medium">$1%</span>');
  
  return formatted;
};

export default function AdviceReport({ sections }: AdviceReportProps) {
  const { sections: storeSections, setSections, updateSection } = useReportStore();
  const { malePartner, femalePartner, setPartnerNames } = useCustomerStore();

  useEffect(() => {
    if (sections?.length > 0) {
      setSections(sections);
    }

    // Listen for term implementation events
    const handleImplementTerm = (event: CustomEvent<{ term: string; explanation: string }>) => {
      const { term, explanation } = event.detail;
      const sectionIndex = Number(
        document.querySelector('[data-section-index]')?.getAttribute('data-section-index')
      );
      
      if (!isNaN(sectionIndex) && storeSections[sectionIndex]) {
        const currentContent = storeSections[sectionIndex].content;
        const newContent = currentContent + `\n\n${explanation}`;
        updateSection(sectionIndex, newContent);
      }
    };

    document.addEventListener('implementTerm', handleImplementTerm as EventListener);
    return () => {
      document.removeEventListener('implementTerm', handleImplementTerm as EventListener);
    };
  }, [sections, setSections, storeSections, updateSection]);

  const copyToClipboard = async (text: string) => {
    try {
      // Extract only the markdown-formatted section
      const markdownStart = text.indexOf('## ');
      const contentToCopy = markdownStart !== -1 ? text.substring(markdownStart) : text;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentToCopy;
      await navigator.clipboard.writeText(tempDiv.textContent || tempDiv.innerText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getReportData = () => {
    const processContent = (content: string) => {
      const markdownStart = content.indexOf('## ');
      return markdownStart !== -1 ? content.substring(markdownStart) : content;
    };

    return {
      title: 'Hypotheekadvies Rapport',
      samenvatting: processContent(storeSections[0]?.content || ''),
      sections: storeSections.slice(1).map(section => ({
        title: section.title,
        content: processContent(section.content)
      }))
    };
  };

  const replaceNames = (content: string): string => {
    // Remove duplicate unformatted content at the start if present
    let processedContent = content;
    if (content.startsWith('Algemeen\nKopieer Sectie\nAlgemeen\n')) {
      processedContent = content.substring(content.indexOf('## Algemeen'));
    }
    return processedContent
      .replace(/\[klant_man\]/g, malePartner)
      .replace(/\[klant_vrouw\]/g, femalePartner);
  };

  const renderContent = (content: string, sectionIndex: number) => {
    // Apply name replacements first
    content = replaceNames(content);
    const terms = identifyTerms(content);
    
    // Extract only the markdown-formatted section (starting with ##)
    const markdownStart = content.indexOf('## ');
    if (markdownStart === -1) return null;
    content = content.substring(markdownStart);
    
    // Split into major sections (##)
    const majorSections = content.split(/(?=^##\s)/m).filter(Boolean);
    
    return (
      <div className="space-y-8">
        {majorSections.map((majorSection, majorIndex) => {
          // Split the major section into title and content
          const [majorTitle, ...majorContent] = majorSection.split('\n');
          const majorHeading = majorTitle.replace(/^##\s/, '');
          
          // Split remaining content into subsections (###)
          const subsections = majorContent.join('\n').split(/(?=^###\s)/m).filter(Boolean);
          
          return (
            <div key={majorIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Major section header */}
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">{majorHeading}</h2>
              </div>
              
              {/* Subsections container */}
              <div className="p-6 space-y-6">
                {subsections.map((subsection, subIndex) => {
                  // Split subsection into title and content
                  const [subTitle, ...subContent] = subsection.split('\n');
                  const subHeading = subTitle.replace(/^###\s/, '').trim();
                  let content = subContent.join('\n').trim();
                  
                  return (
                    <div key={subIndex} className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">{subHeading}</h3>
                      {/* Process content blocks */}
                      {(() => {
                        const blocks = content.split('\n\n');
                        return blocks.map((block, blockIndex) => {
                          const lines = block.split('\n');
                          
                          // Check if this is a list block
                          if (lines.every(line => line.trim().startsWith('- ') || !line.trim())) {
                            const items = lines
                              .filter(line => line.trim().startsWith('- '))
                              .map(line => line.trim().substring(2));
                            
                            return (
                              <ul key={blockIndex} className="list-disc pl-5 space-y-2 mb-4">
                                {items.map((item, i) => (
                                  <li key={i} className="text-gray-700">
                                    {item.split(/\b/).map((word, j) => {
                                      if (terms.includes(word.toLowerCase())) {
                                        return (
                                          <ExplanatoryTerm
                                            key={j}
                                            term={word}
                                            context={item}
                                          />
                                        );
                                      }
                                      return word;
                                    })}
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          
                          // Check if this is a numbered list block
                          if (lines.every(line => /^\d+\.\s/.test(line.trim()) || !line.trim())) {
                            const items = lines
                              .filter(line => /^\d+\.\s/.test(line.trim()))
                              .map(line => line.trim().replace(/^\d+\.\s/, ''));
                            
                            return (
                              <ol key={blockIndex} className="list-decimal pl-5 space-y-2 mb-4">
                                {items.map((item, i) => (
                                  <li key={i} className="text-gray-700">
                                    {item.split(/\b/).map((word, j) => {
                                      if (terms.includes(word.toLowerCase())) {
                                        return (
                                          <ExplanatoryTerm
                                            key={j}
                                            term={word}
                                            context={item}
                                          />
                                        );
                                      }
                                      return word;
                                    })}
                                  </li>
                                ))}
                              </ol>
                            );
                          }
                          
                          // Regular paragraph block
                          const formattedBlock = block
                            // Format bold text
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                            // Format italic text
                            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
                            // Format currency values
                            .replace(/€(\d+([.,]\d+)?)/g, '<span class="text-gray-900 font-medium">€ $1</span>')
                            // Format percentages
                            .replace(/(\d+)%/g, '<span class="text-gray-900 font-medium">$1%</span>');

                          return (
                            <p 
                              key={blockIndex} 
                              className="text-gray-700 mb-4 last:mb-0"
                              dangerouslySetInnerHTML={{ 
                                __html: formattedBlock.split(/\b/).map(word => {
                                  if (terms.includes(word.toLowerCase())) {
                                    return `<span class="explanatory-term" data-term="${word}" data-context="${block}">${word}</span>`;
                                  }
                                  return word;
                                }).join('')
                              }}
                            />
                          );
                        });
                      })()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (!sections?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Adviesrapport</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setPartnerNames(
              window.prompt('Naam mannelijke partner:', malePartner) || malePartner,
              window.prompt('Naam vrouwelijke partner:', femalePartner) || femalePartner
            )}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 
                     border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          >
            Namen invullen
          </button>
          <DownloadButton 
            report={getReportData()} 
            type="hypotheek"
          />
          <button
            onClick={() => copyToClipboard(storeSections.map(s => replaceNames(s.content)).join('\n\n'))}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 
                     border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Kopieer volledig rapport
          </button>
        </div>
      </div>

      {storeSections.map((section, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {section.title}
              </h2>
              <button
                onClick={() => copyToClipboard(replaceNames(section.content))}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 
                         border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Kopieer sectie
              </button>
            </div>

            <div className="prose max-w-none" data-section-index={index}>
              {renderContent(section.content, index)}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <BlockEditor
                content={section.content}
                title={section.title}
                onUpdate={(newContent: string) => updateSection(index, newContent)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
