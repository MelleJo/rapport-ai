interface ReportDisplayProps {
    report: string | null;
  }
  
  export default function ReportDisplay({ report }: ReportDisplayProps) {
    if (!report) return null;
  
    return (
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Gegenereerd Rapport</h2>
        <div className="prose max-w-none">
          {report.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(report)}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Kopieer Rapport
        </button>
      </div>
    );
  }