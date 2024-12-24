'use client';

import { useState } from 'react';
import TranscriptInput from '@/components/TranscriptInput';
import FinancialPlanningForm from '@/components/FinancialPlanningForm';

export default function FinancialPlanningPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Financieel Planning Generator</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <FinancialPlanningForm />
        </div>
      </div>
    </div>
  );
}
