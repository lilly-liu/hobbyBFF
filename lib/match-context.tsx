'use client'

import { createContext, useContext } from 'react'

interface MatchContextValue {
  triggerMatch: (buddyId: string) => void
}

export const MatchContext = createContext<MatchContextValue | null>(null)

export function useMatch(): MatchContextValue {
  const ctx = useContext(MatchContext)
  if (!ctx) throw new Error('useMatch must be used within MatchContext')
  return ctx
}
