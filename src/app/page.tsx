import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Rapport AI - Financieel Advies Generator
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Link 
          href="/hypotheek"
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Hypotheek</h2>
          <p className="text-gray-600">
            Genereer hypotheekadvies rapportages
          </p>
        </Link>

        <Link 
          href="/financieel"
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Financieel</h2>
          <p className="text-gray-600">
            Maak financiële planning rapportages
          </p>
        </Link>

        <Link 
          href="/pensioen"
          className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Pensioen</h2>
          <p className="text-gray-600">
            Creëer pensioenadvies rapportages
          </p>
        </Link>
      </div>
    </div>
  )
}