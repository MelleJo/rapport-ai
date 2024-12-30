// src/components/StoreHydration.tsx
'use client'

import { useEffect, useState } from 'react'
import { useTranscriptStore } from './useTranscriptStore'
import { useReportStore } from './useReportStore'
import { useCustomerStore } from '../stores/useCustomerStore'

export default function StoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const hydrate = async () => {
      // Hydrate all stores
      await Promise.all([
        useTranscriptStore.persist.rehydrate(),
        useReportStore.persist.rehydrate(),
        useCustomerStore.persist.rehydrate()
      ])
      setIsHydrated(true)
    }

    hydrate()
  }, [])

  return null
}