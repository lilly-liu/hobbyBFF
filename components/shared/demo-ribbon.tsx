'use client'

import { Info } from 'lucide-react'

export function DemoRibbon() {
  return (
    <div className="flex items-center justify-center gap-2 bg-foreground px-4 py-1.5 text-center text-[11px] leading-tight font-medium text-background">
      <Info className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="text-balance">
        Demo with sample profiles and classes. Bookings and messages are simulated.
      </span>
    </div>
  )
}
