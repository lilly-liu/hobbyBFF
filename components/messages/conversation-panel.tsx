'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { CONVERSATION_STARTERS } from '@/lib/mock-data'
import { getBuddy, getClass, useDemo } from '@/lib/store'
import { HbImage } from '@/components/shared/hb-image'
import { MessageBubble } from '@/components/messages/message-bubble'
import { ProposalCard } from '@/components/messages/proposal-card'
import { SharedClassHeader } from '@/components/messages/shared-class-header'
import { ProposeSessionDialog } from '@/components/messages/propose-session-dialog'

export function ConversationPanel({
  buddyId,
  onBack,
}: {
  buddyId: string
  onBack?: () => void
}) {
  const { conversations, sendMessage, proposeSession } = useDemo()
  const convo = conversations[buddyId]
  const buddy = getBuddy(buddyId)
  const listing = convo ? getClass(convo.classId) : undefined
  const [draft, setDraft] = useState('')
  const [composing, setComposing] = useState(false)
  const [proposeOpen, setProposeOpen] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const messageCount = convo?.messages.length ?? 0

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messageCount])

  if (!convo || !buddy || !listing) {
    return (
      <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
        Select a conversation to start planning.
      </div>
    )
  }

  const starters = CONVERSATION_STARTERS[listing.category] ?? []
  const myTextCount = convo.messages.filter(
    (m) => m.from === 'me' && m.kind === 'text',
  ).length

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    sendMessage(buddyId, trimmed)
    setDraft('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to messages"
            className="-ml-1 flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        )}
        <div className="size-10 overflow-hidden rounded-full">
          <HbImage src={buddy.photo} alt={buddy.firstName} className="h-full w-full" />
        </div>
        <div className="min-w-0">
          <p className="font-serif text-base font-semibold leading-tight">
            {buddy.firstName}, {buddy.age}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Matched over {listing.subject}
          </p>
        </div>
      </div>

      <SharedClassHeader listing={listing} onSuggest={() => setProposeOpen(true)} />

      <div className="hb-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {convo.messages.map((m) =>
          m.kind === 'proposal' && m.proposal ? (
            <ProposalCard
              key={m.id}
              proposal={m.proposal}
              buddyId={buddyId}
              buddyName={buddy.firstName}
              provider={listing.provider}
              onSuggestAnother={() => setProposeOpen(true)}
            />
          ) : (
            <MessageBubble key={m.id} message={m} />
          ),
        )}
        <div ref={endRef} />
      </div>

      {myTextCount < 2 && starters.length > 0 && (
        <div className="hb-scroll flex gap-2 overflow-x-auto border-t border-border px-4 py-2.5">
          {starters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex items-end gap-2 border-t border-border p-3"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onCompositionStart={() => setComposing(true)}
          onCompositionEnd={() => setComposing(false)}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              !e.shiftKey &&
              !composing &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault()
              send(draft)
            }
          }}
          rows={1}
          placeholder={`Message ${buddy.firstName}…`}
          aria-label={`Message ${buddy.firstName}`}
          className="hb-scroll max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-border bg-card px-4 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Send className="size-5" aria-hidden="true" />
        </button>
      </form>

      <ProposeSessionDialog
        open={proposeOpen}
        onOpenChange={setProposeOpen}
        listing={listing}
        onSubmit={(proposal) => proposeSession(buddyId, proposal)}
      />
    </div>
  )
}
