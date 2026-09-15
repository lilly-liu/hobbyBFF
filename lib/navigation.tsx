'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type View =
  | 'discover'
  | 'class'
  | 'buddies'
  | 'messages'
  | 'plans'
  | 'profile'
  | 'onboarding'

export interface NavState {
  view: View
  classId?: string
  buddyId?: string
  conversationId?: string
  // the activity a buddy search / match is anchored to
  contextClassId?: string
}

interface NavContextValue extends NavState {
  navigate: (next: Partial<NavState> & { view: View }) => void
  goBack: () => void
  canGoBack: boolean
}

const NavContext = createContext<NavContextValue | null>(null)

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<NavState[]>([{ view: 'discover' }])

  const navigate = useCallback((next: Partial<NavState> & { view: View }) => {
    const roots: View[] = ['discover', 'buddies', 'messages', 'plans', 'profile']
    const isRootReset =
      roots.includes(next.view) &&
      !next.classId &&
      !next.buddyId &&
      !next.conversationId &&
      !next.contextClassId
    setStack((prev) => {
      if (isRootReset) {
        return [{ view: next.view }]
      }
      const current = prev[prev.length - 1]
      // Preserve context class when moving between related screens unless overridden.
      const merged: NavState = {
        contextClassId: current.contextClassId,
        ...next,
      }
      if (
        merged.view === current.view &&
        merged.classId === current.classId &&
        merged.buddyId === current.buddyId &&
        merged.conversationId === current.conversationId &&
        merged.contextClassId === current.contextClassId
      ) {
        return prev
      }
      return [...prev, merged]
    })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  const current = stack[stack.length - 1]

  const value = useMemo<NavContextValue>(
    () => ({
      ...current,
      navigate,
      goBack,
      canGoBack: stack.length > 1,
    }),
    [current, navigate, goBack, stack.length],
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext)
  if (!ctx) throw new Error('useNav must be used within NavProvider')
  return ctx
}
