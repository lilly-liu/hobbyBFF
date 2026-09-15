'use client'

import { DemoProvider } from '@/lib/store'
import { NavProvider } from '@/lib/navigation'
import { AppShell } from '@/components/app-shell'

export function AppRoot() {
  return (
    <DemoProvider>
      <NavProvider>
        <AppShell />
      </NavProvider>
    </DemoProvider>
  )
}
