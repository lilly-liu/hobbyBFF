'use client'

import { useState } from 'react'
import { CalendarDays, Check, MapPin } from 'lucide-react'
import type { ClassListing, SessionProposal } from '@/lib/types'
import { formatDateLong, formatPrice } from '@/lib/format'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ProposeSessionDialog({
  open,
  onOpenChange,
  listing,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  listing: ClassListing
  onSubmit: (proposal: SessionProposal) => void
}) {
  const [sessionId, setSessionId] = useState(listing.sessions[0]?.id ?? '')

  const location = `${listing.provider}, ${listing.neighborhood}`

  function submit() {
    const session = listing.sessions.find((s) => s.id === sessionId)
    if (!session) return
    onSubmit({
      id: `prop-${listing.id}-${Date.now()}`,
      classId: listing.id,
      date: session.date,
      time: session.time,
      location,
      pricePerPerson: listing.pricePerPerson,
      status: 'proposed',
      proposedBy: 'me',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="font-serif text-xl">Suggest a session</DialogTitle>
        <DialogDescription>
          Pick a time for {listing.title}. Your buddy can accept or suggest another.
        </DialogDescription>

        <div className="flex flex-col gap-2">
          {listing.sessions.map((s) => {
            const active = sessionId === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSessionId(s.id)}
                aria-pressed={active}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                  active
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border hover:border-foreground/30',
                )}
              >
                <span className="flex items-center gap-3">
                  <CalendarDays
                    className={cn('size-5', active ? 'text-primary' : 'text-muted-foreground')}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block font-medium">{formatDateLong(s.date)}</span>
                    <span className="block text-sm text-muted-foreground">
                      {s.time} · {s.timeOfDay}
                    </span>
                  </span>
                </span>
                {active && <Check className="size-4 text-primary" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        <div className="rounded-xl bg-muted/50 p-3 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />
            {location}
          </p>
          <p className="mt-1 text-muted-foreground">
            {formatPrice(listing.pricePerPerson)} per person
          </p>
        </div>

        <Button className="h-10 w-full" onClick={submit}>
          Send suggestion
        </Button>
      </DialogContent>
    </Dialog>
  )
}
