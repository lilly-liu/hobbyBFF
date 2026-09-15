'use client'

import type { Conversation } from '@/lib/types'
import { getBuddy, getClass } from '@/lib/store'
import { formatTimeAgo } from '@/lib/format'
import { HbImage } from '@/components/shared/hb-image'
import { cn } from '@/lib/utils'

function previewOf(convo: Conversation): string {
  const last = convo.messages[convo.messages.length - 1]
  if (!last) return 'Say hello'
  if (last.kind === 'proposal' && last.proposal) {
    const who = last.proposal.proposedBy === 'me' ? 'You' : 'They'
    if (last.proposal.status === 'agreed') return 'Session agreed'
    if (last.proposal.status === 'booking_pending') return 'Booking in progress'
    return `${who} suggested a session`
  }
  return last.from === 'me' ? `You: ${last.text}` : (last.text ?? '')
}

export function ConversationList({
  convos,
  activeId,
  onSelect,
}: {
  convos: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4 md:px-5">
        <h1 className="font-serif text-2xl font-semibold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          {convos.length} {convos.length === 1 ? 'match' : 'matches'} · say hello and
          make a plan
        </p>
      </div>
      <ul className="hb-scroll flex-1 overflow-y-auto">
        {convos.map((convo) => {
          const buddy = getBuddy(convo.buddyId)
          const listing = getClass(convo.classId)
          if (!buddy || !listing) return null
          const active = activeId === convo.buddyId
          return (
            <li key={convo.buddyId}>
              <button
                type="button"
                onClick={() => onSelect(convo.buddyId)}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors md:px-5',
                  active ? 'bg-primary/6' : 'hover:bg-muted/60',
                )}
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
                  <HbImage src={buddy.photo} alt={buddy.firstName} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-medium">
                      {buddy.firstName}, {buddy.age}
                    </p>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatTimeAgo(convo.lastActivity)}
                    </span>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {previewOf(convo)}
                  </p>
                  <p className="truncate text-xs text-primary">{listing.title}</p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
