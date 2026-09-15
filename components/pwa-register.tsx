'use client'

import { useEffect } from 'react'
import { assetPath } from '@/lib/asset-path'

export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(assetPath('/sw.js')).catch(console.error)
    }
  }, [])
  return null
}
