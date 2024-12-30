// src/components/FinancialPlanningReport.tsx
'use client'

import React from 'react';
import { Card } from '@/components/ui/card';
import BlockEditor from '@/components/BlockEditor';
import DownloadButton from '@/components/ui/DownloadButton';
import { useCustomerStore } from '@/stores';
import NameReplacer from '@/components/NameReplacer';

interface ReportSection {
  title: string;
  content: string;
  graphs?: string[];
}

interface FinancialPlanningReport {
  samenvatting: string;
  sections: ReportSection[];
  actiepuntenClient: string[];
  actiepuntenAdviseur: string[];
}

interface FinancialPlanningReportProps {
  report: FinancialPlanningReport;
}

export default function FinancialPlanningReport({ report: initialReport }: FinancialPlanningReportProps) {
  const [report, setReport] = React.useState(initialReport);
  const { malePartner, femalePartner, setPartnerNames } = useCustomerStore();

  const copyToClipboard = async (text: string) => {
    try {
      const formattedText = replaceNames(text.replace(/\[Grafiek: (.*?)\]/g, '\n[GRAFIEK: $1]\n'));
      await navigator.clipboard.writeText(formattedText);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSectionUpdate = (sectionIndex: number, newContent: string) => {
    const updatedReport = { ...report };
    updatedReport.sections[sectionIndex].content = newContent;
    setReport(updatedReport);
  };

  const handleSummaryUpdate = (newContent: string) => {
    setReport({ ...report, samenvatting: newContent });
  };

  const handleActiepuntenClientUpdate = (newContent: string) => {
    const newPoints = newContent.split('\n').filter(point => point.trim());
    setReport({ ...report, actiepuntenClient: newPoints });
  };

  const handleActiepuntenAdviseurUpdate = (newContent: string) => {
    const newPoints = newContent.split('\n').filter(point => point.trim());
    setReport({ ...report, actiepuntenAdviseur: newPoints });
  };

  const replaceNames = (content: string): string => {
    return content
      .replace(/\[klant_man\]/g, malePartner)
      .replace(/\[klant_vrouw\]/g, femalePartner);
  };

  const copyFullReport = () => {
    const fullReport = `# Financieel Advies Rapport

## Samenvatting
${report.samenvatting}

${report.sections.map(section => `## ${section.title}
${section.content}
${section.graphs?.map(graph => `\n[GRAFIEK: ${graph}]\n`).join('') || ''}`).join('\n\n')}

## Actiepunten

### Actiepunten cliënt
${report.actiepuntenClient.map(point => `- ${point}`).join('\n')}

### Actiepunten adviseur
${report.actiepuntenAdviseur.map(point => `- ${point}`).join('\n')}`;

    copyToClipboard(fullReport);
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {replaceNames(paragraph)}
      </p>
    ));
  };

  const renderGraphPlaceholder = (graphName: string) => {
    return (
      <div className="my-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500">
        [Grafiek: {graphName}]
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financieel Advies Rapport</h2>
        <div className="flex gap-2">
          <NameReplacer onReplace={setPartnerNames} />
          <DownloadButton 
            report={report} 
            type="financial-planning"
          />
          <button
            onClick={copyFullReport}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kopieer Volledig Rapport
          </button>
        </div>
      </div>

      <Card className="p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Samenvatting van het advies</h3>
          <button
            onClick={() => copyToClipboard(report.samenvatting)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 
                     border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Kopieer Sectie
          </button>
        </div>
        <div className="prose max-w-none">
          {renderContent(report.samenvatting)}
        </div>
        <BlockEditor
          content={report.samenvatting}
          title="Samenvatting"
          onUpdate={handleSummaryUpdate}
        />
      </Card>

      {report.sections.map((section, index) => (
        <Card key={index} className="p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <button
              onClick={() => copyToClipboard(section.content)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 
                       border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Kopieer Sectie
            </button>
          </div>
          <div className="prose max-w-none">
            {renderContent(section.content)}
            {section.graphs?.map((graph, graphIndex) => (
              <div key={graphIndex}>
                {renderGraphPlaceholder(graph)}
              </div>
            ))}
          </div>
          <BlockEditor
            content={section.content}
            title={section.title}
            onUpdate={(newContent) => handleSectionUpdate(index, newContent)}
          />
        </Card>
      ))}

      <Card className="p-6 relative">
        <h3 className="text-xl font-semibold mb-4">Actiepunten</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Actiepunten cliënt</h4>
              <button
                onClick={() => copyToClipboard(report.actiepuntenClient.join('\n'))}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 
                         border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Kopieer Actiepunten
              </button>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              {report.actiepuntenClient.map((point, index) => (
                <li key={index}>{replaceNames(point)}</li>
              ))}
            </ul>
            <BlockEditor
              content={report.actiepuntenClient.join('\n')}
              title="Actiepunten Cliënt"
              onUpdate={handleActiepuntenClientUpdate}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Actiepunten adviseur</h4>
              <button
                onClick={() => copyToClipboard(report.actiepuntenAdviseur.join('\n'))}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 
                         border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Kopieer Actiepunten
              </button>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              {report.actiepuntenAdviseur.map((point, index) => (
                <li key={index}>{replaceNames(point)}</li>
              ))}
            </ul>
            <BlockEditor
              content={report.actiepuntenAdviseur.join('\n')}
              title="Actiepunten Adviseur"
              onUpdate={handleActiepuntenAdviseurUpdate}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}