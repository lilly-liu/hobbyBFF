'use client'

import { useMemo, useState } from 'react'
import { LayoutGrid, Layers, ArrowLeft, Sparkles } from 'lucide-react'
import { BUDDIES } from '@/lib/mock-data'
import { getBuddy, getClass, useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { useMatch } from '@/lib/match-context'
import { HbImage } from '@/components/shared/hb-image'
import { Button } from '@/components/ui/button'
import { BuddyCard, DecisionButtons } from '@/components/buddies/buddy-card'
import { BuddyGridCard } from '@/components/buddies/buddy-grid-card'
import { BuddyProfileOverlay } from '@/components/buddies/buddy-profile-overlay'
import { cn } from '@/lib/utils'

type ViewMode = 'cards' | 'grid'

export function BuddiesView({
  contextClassId,
  buddyId,
}: {
  contextClassId?: string
  buddyId?: string
}) {
  const {
    passedBuddyIds,
    likedBuddyIds,
    matchedBuddyIds,
    passBuddy,
    likeBuddy,
    undoPass,
    lastPassedBuddyId,
  } = useDemo()
  const nav = useNav()
  const { triggerMatch } = useMatch()
  const [mode, setMode] = useState<ViewMode>('cards')
  const [profileId, setProfileId] = useState<string | null>(buddyId ?? null)

  const contextClass = contextClassId ? getClass(contextClassId) : undefined

  const visible = useMemo(() => {
    const hidden = new Set([
      ...passedBuddyIds,
      ...likedBuddyIds,
      ...matchedBuddyIds,
    ])
    const list = BUDDIES.filter((b) => !hidden.has(b.id))
    if (!contextClass) return list
    const score = (id: string) => {
      const c = getClass(id)
      if (!c) return 0
      if (c.id === contextClass.id) return 2
      if (c.category === contextClass.category) return 1
      return 0
    }
    return [...list].sort(
      (a, b) => score(b.wantsToTryClassId) - score(a.wantsToTryClassId),
    )
  }, [passedBuddyIds, likedBuddyIds, matchedBuddyIds, contextClass])

  function handleLike(id: string) {
    const matched = likeBuddy(id)
    if (matched) triggerMatch(id)
  }

  const profileBuddy = profileId ? getBuddy(profileId) : undefined
  const stack = visible.slice(0, 2)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6 md:pt-8">
      {contextClass ? (
        <div className="mb-5">
          <button
            type="button"
            onClick={() =>
              nav.canGoBack ? nav.goBack() : nav.navigate({ view: 'discover' })
            }
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to class
          </button>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="size-14 shrink-0 overflow-hidden rounded-xl">
              <HbImage
                src={contextClass.image}
                alt={contextClass.title}
                className="h-full w-full"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                Finding a buddy for
              </p>
              <p className="truncate font-serif text-lg font-semibold">
                {contextClass.title}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {contextClass.neighborhood} · {contextClass.category}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <h1 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">
            Find your buddy
          </h1>
          <p className="mt-1.5 text-muted-foreground text-pretty">
            People near you who want to try the same things — for real, together.
          </p>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? 'buddy' : 'buddies'} to browse
        </p>
        <div
          className="inline-flex rounded-full border border-border bg-card p-1"
          role="group"
          aria-label="Buddy view mode"
        >
          <button
            type="button"
            aria-pressed={mode === 'cards'}
            onClick={() => setMode('cards')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              mode === 'cards'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Layers className="size-4" aria-hidden="true" />
            Cards
          </button>
          <button
            type="button"
            aria-pressed={mode === 'grid'}
            onClick={() => setMode('grid')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              mode === 'grid'
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            Grid
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyBuddies canUndo={!!lastPassedBuddyId} onUndo={undoPass} />
      ) : mode === 'cards' ? (
        <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6">
          <div className="relative w-full">
            <div className="aspect-[3/4] w-full" aria-hidden="true" />
            {stack
              .map((buddy, i) => ({ buddy, i }))
              .reverse()
              .map(({ buddy, i }) => {
                const isTop = i === 0
                return (
                  <div
                    key={buddy.id}
                    className="absolute inset-0"
                    style={{
                      transform: isTop
                        ? undefined
                        : 'scale(0.95) translateY(14px)',
                      opacity: isTop ? 1 : 0.7,
                      zIndex: isTop ? 2 : 1,
                      pointerEvents: isTop ? 'auto' : 'none',
                    }}
                  >
                    <BuddyCard
                      buddy={buddy}
                      contextClass={contextClass}
                      interactive={isTop}
                      onPass={() => passBuddy(buddy.id)}
                      onLike={() => handleLike(buddy.id)}
                      onOpen={() => setProfileId(buddy.id)}
                    />
                  </div>
                )
              })}
          </div>

          <DecisionButtons
            onPass={() => visible[0] && passBuddy(visible[0].id)}
            onLike={() => visible[0] && handleLike(visible[0].id)}
            onUndo={undoPass}
            canUndo={!!lastPassedBuddyId}
          />
          <p className="text-center text-xs text-muted-foreground">
            Swipe the card, or use the buttons. Nothing is shared until you both say
            yes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((buddy) => (
            <BuddyGridCard
              key={buddy.id}
              buddy={buddy}
              contextClass={contextClass}
              onPass={() => passBuddy(buddy.id)}
              onLike={() => handleLike(buddy.id)}
              onOpen={() => setProfileId(buddy.id)}
            />
          ))}
        </div>
      )}

      {profileBuddy && (
        <BuddyProfileOverlay
          buddy={profileBuddy}
          contextClass={
            contextClass ?? getClass(profileBuddy.wantsToTryClassId)
          }
          onClose={() => setProfileId(null)}
          onPass={() => passBuddy(profileBuddy.id)}
          onLike={() => handleLike(profileBuddy.id)}
        />
      )}
    </div>
  )
}

function EmptyBuddies({
  canUndo,
  onUndo,
}: {
  canUndo: boolean
  onUndo: () => void
}) {
  const nav = useNav()
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-6" aria-hidden="true" />
      </span>
      <p className="font-serif text-xl font-semibold">You&apos;re all caught up</p>
      <p className="max-w-sm text-sm text-muted-foreground text-pretty">
        You&apos;ve seen everyone hoping to try this for now. Check your matches, or
        widen your search back on Discover.
      </p>
      <div className="mt-1 flex flex-wrap justify-center gap-2">
        {canUndo && (
          <Button variant="outline" onClick={onUndo}>
            Undo last pass
          </Button>
        )}
        <Button onClick={() => nav.navigate({ view: 'discover' })}>
          Back to Discover
        </Button>
      </div>
    </div>
  )
}
