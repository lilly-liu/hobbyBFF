'use client'

import { useState } from 'react'
import {
  CalendarDays,
  MapPin,
  Clock,
  CircleCheck,
  Hourglass,
  Check,
  ExternalLink,
} from 'lucide-react'
import type { SessionProposal } from '@/lib/types'
import { useDemo } from '@/lib/store'
import { formatDateLong, formatPrice } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const STATUS_META: Record<
  SessionProposal['status'],
  { label: string; className: string; icon: typeof CircleCheck }
> = {
  proposed: {
    label: 'Proposed',
    className: 'bg-butter/40 text-butter-foreground',
    icon: Hourglass,
  },
  agreed: {
    label: 'Agreed',
    className: 'bg-sage/30 text-sage-foreground',
    icon: CircleCheck,
  },
  booking_pending: {
    label: 'Booking pending',
    className: 'bg-primary/12 text-primary',
    icon: ExternalLink,
  },
}

export function ProposalCard({
  proposal,
  buddyId,
  buddyName,
  provider,
  onSuggestAnother,
}: {
  proposal: SessionProposal
  buddyId: string
  buddyName: string
  provider: string
  onSuggestAnother: () => void
}) {
  const { updateProposal, sendMessage, sendBuddyMessage } = useDemo()
  const [bookingOpen, setBookingOpen] = useState(false)
  const meta = STATUS_META[proposal.status]
  const StatusIcon = meta.icon
  const mine = proposal.proposedBy === 'me'

  function accept() {
    updateProposal(buddyId, proposal.id, 'agreed')
    sendMessage(buddyId, 'That works for me — locking it in!')
  }

  function simulateReply() {
    updateProposal(buddyId, proposal.id, 'agreed')
    sendBuddyMessage(
      buddyId,
      'Perfect, that works! Adding it to my calendar now.',
    )
  }

  return (
    <div className="mx-auto w-full max-w-[85%] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <p className="text-xs font-medium text-muted-foreground">
          {mine ? 'You suggested' : `${buddyName} suggested`}
        </p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
            meta.className,
          )}
        >
          <StatusIcon className="size-3" aria-hidden="true" />
          {meta.label}
        </span>
      </div>

      <div className="flex flex-col gap-2 px-4 py-3 text-sm">
        <p className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" aria-hidden="true" />
          <span className="font-medium">{formatDateLong(proposal.date)}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" aria-hidden="true" />
          {proposal.time}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          {proposal.location}
        </p>
        <p className="text-muted-foreground">
          {formatPrice(proposal.pricePerPerson)} per person, paid to {provider}
        </p>
      </div>

      <div className="border-t border-border p-3">
        {proposal.status === 'proposed' && !mine && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={onSuggestAnother}>
              Suggest another time
            </Button>
            <Button size="sm" className="flex-1" onClick={accept}>
              <Check aria-hidden="true" />
              Accept
            </Button>
          </div>
        )}

        {proposal.status === 'proposed' && mine && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-xs text-muted-foreground">
              Waiting for {buddyName} to reply.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={simulateReply}
            >
              Simulate {buddyName}&apos;s reply (demo)
            </Button>
          </div>
        )}

        {proposal.status === 'agreed' && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-sm font-medium text-foreground">
              You&apos;re on. Time to grab your spots.
            </p>
            <Button
              size="sm"
              className="w-full"
              onClick={() => {
                updateProposal(buddyId, proposal.id, 'booking_pending')
                setBookingOpen(true)
              }}
            >
              <ExternalLink aria-hidden="true" />
              Book with {provider} (demo)
            </Button>
          </div>
        )}

        {proposal.status === 'booking_pending' && (
          <div className="flex flex-col gap-2">
            <p className="text-center text-xs text-muted-foreground text-pretty">
              Booking handoff started — each of you reserves a seat with the provider.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setBookingOpen(true)}
            >
              Open booking handoff
            </Button>
          </div>
        )}
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogTitle className="font-serif text-xl">Demo booking handoff</DialogTitle>
          <DialogDescription>
            In the full app, this is where you&apos;d each reserve and pay for your seat
            directly with {provider}.
          </DialogDescription>
          <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm">
            <p className="font-medium">{formatDateLong(proposal.date)} · {proposal.time}</p>
            <p className="text-muted-foreground">{proposal.location}</p>
            <p className="mt-1 text-muted-foreground">
              {formatPrice(proposal.pricePerPerson)} per person
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            No reservation is made and no payment is taken in this prototype.
          </p>
          <Button className="h-10 w-full" onClick={() => setBookingOpen(false)}>
            Got it
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
