'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { Button } from '@/components/ui/button'
import { ConversationList } from '@/components/messages/conversation-list'
import { ConversationPanel } from '@/components/messages/conversation-panel'

export function MessagesView({ conversationId }: { conversationId?: string }) {
  const { conversations } = useDemo()
  const nav = useNav()
  const convos = Object.values(conversations).sort(
    (a, b) => b.lastActivity - a.lastActivity,
  )
  const [activeId, setActiveId] = useState<string | null>(conversationId ?? null)

  useEffect(() => {
    if (conversationId) setActiveId(conversationId)
  }, [conversationId])

  useEffect(() => {
    if (
      !activeId &&
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 768px)').matches &&
      convos.length > 0
    ) {
      setActiveId(convos[0].buddyId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (convos.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MessageCircle className="size-6" aria-hidden="true" />
        </span>
        <h1 className="font-serif text-2xl font-semibold">No matches yet</h1>
        <p className="max-w-sm text-sm text-muted-foreground text-pretty">
          When you and a buddy both say yes, your chat opens up here — with the class
          you&apos;re trying pinned to the top.
        </p>
        <Button onClick={() => nav.navigate({ view: 'buddies' })}>
          Find a buddy
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-6xl md:px-6 md:py-6">
        <div className="md:grid md:h-[calc(100dvh-8.5rem)] md:grid-cols-[340px_1fr] md:overflow-hidden md:rounded-2xl md:border md:border-border md:bg-card">
          <div className="md:overflow-hidden md:border-r md:border-border">
            <ConversationList
              convos={convos}
              activeId={activeId}
              onSelect={setActiveId}
            />
          </div>
          <div className={activeId ? 'fixed inset-0 z-50 flex flex-col bg-background md:static md:z-auto md:min-h-0' : 'hidden md:flex md:min-h-0 md:flex-col'}>
            {activeId ? (
              <ConversationPanel key={activeId} buddyId={activeId} onBack={() => setActiveId(null)} />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                Pick a match to start planning.
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  )
}
