// src/components/NavigationManager.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useNavigationStore } from '@/stores'

export default function NavigationManager() {
  const pathname = usePathname()
  const { setCurrentPath } = useNavigationStore()

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname)
    }
  }, [pathname, setCurrentPath])

  return null
}