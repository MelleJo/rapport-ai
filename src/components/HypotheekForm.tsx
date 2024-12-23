'use client'

import { useState } from 'react'
import LoadingSpinner from './ui/LoadingSpinner'
import ReportDisplay from './ReportDisplay'

interface CustomerData {
  naam: string;
  inkomen: number;
  leeftijd: number;
  woningWaarde: number;
  eigenVermogen: number;
}

const initialData: CustomerData = {
  naam: '',
  inkomen: 0,
  leeftijd: 0,
  woningWaarde: 0,
  eigenVermogen: 0
}

export default function HypotheekForm() {
  const [customerData, setCustomerData] = useState<CustomerData>(initialData);
  const [advisorNotes, setAdvisorNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerData,
          advisorNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Er is een fout opgetreden');
      }

      setReport(data.report);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Er is een fout opgetreden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Klantgegevens</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Naam
            </label>
            <input
              type="text"
              value={customerData.naam}
              onChange={(e) => setCustomerData({...customerData, naam: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jaarlijks Inkomen
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="number"
                value={customerData.inkomen}
                onChange={(e) => setCustomerData({...customerData, inkomen: Number(e.target.value)})}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leeftijd
            </label>
            <input
              type="number"
              value={customerData.leeftijd}
              onChange={(e) => setCustomerData({...customerData, leeftijd: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="18"
              max="120"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Woning Waarde
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="number"
                value={customerData.woningWaarde}
                onChange={(e) => setCustomerData({...customerData, woningWaarde: Number(e.target.value)})}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Eigen Vermogen
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
              <input
                type="number"
                value={customerData.eigenVermogen}
                onChange={(e) => setCustomerData({...customerData, eigenVermogen: Number(e.target.value)})}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="0.00"
                required
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Adviseur Notities</h2>
          <textarea
            value={advisorNotes}
            onChange={(e) => setAdvisorNotes(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Voeg hier uw notities toe over het adviesgesprek..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? <LoadingSpinner /> : 'Genereer Rapport'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {report && <ReportDisplay report={report} />}
    </div>
  );
}