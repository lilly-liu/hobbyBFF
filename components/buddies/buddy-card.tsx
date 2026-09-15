'use client'

import { useRef, useState } from 'react'
import { CalendarClock, Sparkles, Maximize2, X, Heart, Undo2 } from 'lucide-react'
import type { Buddy, ClassListing } from '@/lib/types'
import { HbImage } from '@/components/shared/hb-image'
import { cn } from '@/lib/utils'

const THRESHOLD = 110

export function BuddyCard({
  buddy,
  contextClass,
  onPass,
  onLike,
  onOpen,
  interactive,
}: {
  buddy: Buddy
  contextClass?: ClassListing
  onPass: () => void
  onLike: () => void
  onOpen: () => void
  interactive: boolean
}) {
  const [dx, setDx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [leaving, setLeaving] = useState<null | 'like' | 'pass'>(null)
  const startX = useRef<number | null>(null)

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function decide(kind: 'like' | 'pass') {
    if (prefersReduced) {
      kind === 'like' ? onLike() : onPass()
      return
    }
    setLeaving(kind)
    window.setTimeout(() => {
      kind === 'like' ? onLike() : onPass()
    }, 220)
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!interactive) return
    startX.current = e.clientX
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startX.current === null) return
    setDx(e.clientX - startX.current)
  }
  function onPointerUp() {
    if (startX.current === null) return
    startX.current = null
    setDragging(false)
    if (dx > THRESHOLD) decide('like')
    else if (dx < -THRESHOLD) decide('pass')
    else setDx(0)
  }

  const translate =
    leaving === 'like'
      ? 'translateX(120%) rotate(12deg)'
      : leaving === 'pass'
        ? 'translateX(-120%) rotate(-12deg)'
        : `translateX(${dx}px) rotate(${dx / 22}deg)`

  const likeOpacity = Math.min(Math.max(dx / THRESHOLD, 0), 1)
  const passOpacity = Math.min(Math.max(-dx / THRESHOLD, 0), 1)

  return (
    <div
      className="absolute inset-0 touch-pan-y select-none"
      style={{
        transform: translate,
        transition: dragging ? 'none' : 'transform 0.24s ease-out',
        cursor: interactive ? 'grab' : 'default',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_40px_-20px_rgba(60,40,30,0.45)]">
        <HbImage
          src={buddy.photo}
          alt={buddy.firstName}
          priority
          className="h-full w-full"
        />

        {/* decision overlays */}
        <div
          className="absolute top-6 left-6 rotate-[-12deg] rounded-xl border-4 border-primary px-4 py-1.5 text-2xl font-bold tracking-wide text-primary uppercase"
          style={{ opacity: likeOpacity }}
        >
          Interested
        </div>
        <div
          className="absolute top-6 right-6 rotate-[12deg] rounded-xl border-4 border-foreground px-4 py-1.5 text-2xl font-bold tracking-wide text-foreground uppercase"
          style={{ opacity: passOpacity }}
        >
          Pass
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 text-white">
          {contextClass && (
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3" aria-hidden="true" />
              Wants to try {contextClass.subject}
            </span>
          )}
          <h3 className="font-serif text-2xl font-semibold">
            {buddy.firstName}, {buddy.age}
          </h3>
          <p className="text-sm text-white/80">{buddy.neighborhood}</p>

          <p className="mt-2 line-clamp-2 text-[15px] leading-snug text-white/95 text-pretty">
            &ldquo;{buddy.headlinePrompt}&rdquo;
          </p>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/12 p-2.5 text-xs text-white/90 backdrop-blur">
            <CalendarClock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="text-pretty">{buddy.reason}</span>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur transition-colors hover:bg-white/25 focus-visible:ring-3 focus-visible:ring-white/50 focus-visible:outline-none"
          >
            <Maximize2 className="size-3.5" aria-hidden="true" />
            View full profile
          </button>
        </div>

        {/* on-card quick actions for pointer users */}
        {interactive && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between p-5">
            <span className="sr-only">Use the Pass and Interested buttons below the card.</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function DecisionButtons({
  onPass,
  onLike,
  onUndo,
  canUndo,
}: {
  onPass: () => void
  onLike: () => void
  onUndo: () => void
  canUndo: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Undo last pass"
        className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-all hover:text-foreground disabled:opacity-40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Undo2 className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onPass}
        aria-label="Pass"
        className="flex size-16 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/40 active:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <X className="size-7" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onLike}
        aria-label="Interested"
        className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_-8px_var(--color-primary)] transition-all hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Heart className="size-7 fill-current" aria-hidden="true" />
      </button>
    </div>
  )
}
