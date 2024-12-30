// src/components/StoreHydration.tsx
'use client'

import { useEffect, useState } from 'react'
import { useTranscriptStore } from '../stores/useTranscriptStore'
import { useReportStore } from '../stores/useReportStore'
import { useCustomerStore } from '../stores/useCustomerStore'
import { useNavigationStore } from '../stores/useNavigationStore'
import NavigationManager from './NavigationManager'

export default function StoreHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const hydrate = async () => {
      // Hydrate all stores
      await Promise.all([
        useTranscriptStore.persist.rehydrate(),
        useReportStore.persist.rehydrate(),
        useCustomerStore.persist.rehydrate(),
        useNavigationStore.persist.rehydrate()
      ])
      setIsHydrated(true)
    }

    hydrate()
  }, [])

  // Return NavigationManager to handle route changes
  return <NavigationManager />
}