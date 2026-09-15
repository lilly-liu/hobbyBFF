'use client'

import { useState } from 'react'
import { MapPin, ChevronDown, Check } from 'lucide-react'
import { useDemo } from '@/lib/store'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const LOCATIONS = [
  { label: 'Boston, MA', note: 'All neighborhoods' },
  { label: 'Cambridge', note: 'Across the river' },
  { label: 'Somerville', note: 'Davis, Union & Porter' },
]

export function LocationDialog() {
  const { location, setLocation } = useDemo()
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        }
      >
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        {location}
        <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-serif text-xl">Where are you exploring?</DialogTitle>
        <DialogDescription>
          hobbyBFF is starting out in Greater Boston.
        </DialogDescription>
        <div className="mt-2 flex flex-col gap-2">
          {LOCATIONS.map((loc) => {
            const active = loc.label === location
            return (
              <button
                key={loc.label}
                type="button"
                onClick={() => {
                  setLocation(loc.label)
                  setOpen(false)
                }}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors',
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted',
                )}
              >
                <span>
                  <span className="block font-medium">{loc.label}</span>
                  <span className="block text-sm text-muted-foreground">
                    {loc.note}
                  </span>
                </span>
                {active && <Check className="size-4 text-primary" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
