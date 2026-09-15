'use client'

import { X, Heart, CalendarClock } from 'lucide-react'
import type { Buddy, ClassListing } from '@/lib/types'
import { HbImage } from '@/components/shared/hb-image'
import { Button } from '@/components/ui/button'

export function BuddyGridCard({
  buddy,
  contextClass,
  onPass,
  onLike,
  onOpen,
}: {
  buddy: Buddy
  contextClass?: ClassListing
  onPass: () => void
  onLike: () => void
  onOpen: () => void
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-14px_rgba(60,40,30,0.3)]">
      <button
        type="button"
        onClick={onOpen}
        className="relative block aspect-[4/5] w-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`View ${buddy.firstName}'s profile`}
      >
        <HbImage src={buddy.photo} alt={buddy.firstName} className="h-full w-full" imgClassName="group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-left text-white">
          <h3 className="font-serif text-xl font-semibold">
            {buddy.firstName}, {buddy.age}
          </h3>
          <p className="text-sm text-white/80">{buddy.neighborhood}</p>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm font-medium text-primary">
          Wants to try {contextClass ? contextClass.subject : buddy.wantsToTryLabel.toLowerCase()}
        </p>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground text-pretty">
          <CalendarClock className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          {buddy.reason}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onPass}
          >
            <X aria-hidden="true" />
            Pass
          </Button>
          <Button size="sm" className="flex-1" onClick={onLike}>
            <Heart aria-hidden="true" />
            Interested
          </Button>
        </div>
      </div>
    </article>
  )
}
