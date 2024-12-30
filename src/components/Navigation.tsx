// src/components/Navigation.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {pathname !== '/' && (
              <button
                onClick={() => window.history.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Terug
              </button>
            )}
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <Home className="h-5 w-5 mr-1" />
              Home
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/hypotheek"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname?.startsWith('/hypotheek')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hypotheek
            </Link>
            <Link
              href="/financieel"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname?.startsWith('/financieel')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Financieel
            </Link>
            <Link
              href="/pensioen"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname?.startsWith('/pensioen')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pensioen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}