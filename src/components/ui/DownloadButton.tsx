import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import { generateWordDocument, type ReportData } from '@/lib/documentGenerator';

interface DownloadButtonProps {
  report: {
    samenvatting: string;
    sections: Array<{
      title: string;
      content: string;
      graphs?: string[];
    }>;
    actiepuntenClient?: string[];
    actiepuntenAdviseur?: string[];
  };
  type: 'hypotheek' | 'financial-planning';
  className?: string;
}

export default function DownloadButton({ report, type, className }: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const reportData: ReportData = {
        title: type === 'hypotheek' ? 'Hypotheekadvies Rapport' : 'Financieel Advies Rapport',
        samenvatting: report.samenvatting,
        sections: report.sections,
        actiepuntenClient: report.actiepuntenClient,
        actiepuntenAdviseur: report.actiepuntenAdviseur,
      };

      const blob = await generateWordDocument(reportData);
      const date = new Date().toISOString().split('T')[0];
      saveAs(blob, `${reportData.title} ${date}.docx`);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Er is een fout opgetreden bij het genereren van het document.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors ${className}`}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          <span>Genereren...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>Download als Word</span>
        </>
      )}
    </button>
  );
}
