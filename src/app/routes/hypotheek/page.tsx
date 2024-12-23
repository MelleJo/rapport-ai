import HypotheekForm from '@/components/HypotheekForm'

export default function HypotheekPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hypotheekadvies Generator</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <HypotheekForm />
        </div>
      </div>
    </div>
  )
}