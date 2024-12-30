// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import StoreHydration from '@/components/StoreHydration'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rapport AI - Financieel Advies Generator',
  description: 'Genereer gestructureerde financiële adviezen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <StoreHydration />
        <Navigation />
        <main className="min-h-screen bg-gray-50 pt-6">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}