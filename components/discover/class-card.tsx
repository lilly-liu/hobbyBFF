'use client'

import { Bookmark, MapPin, CalendarDays, Users } from 'lucide-react'
import type { ClassListing } from '@/lib/types'
import { useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { formatDate, formatPrice } from '@/lib/format'
import { HbImage } from '@/components/shared/hb-image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ClassCard({
  listing,
  priority,
}: {
  listing: ClassListing
  priority?: boolean
}) {
  const { isSaved, toggleSave } = useDemo()
  const nav = useNav()
  const saved = isSaved(listing.id)
  const nextSession = listing.sessions[0]

  function openDetails() {
    nav.navigate({ view: 'class', classId: listing.id })
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(60,40,30,0.25)]">
      <div className="relative">
        <button
          type="button"
          onClick={openDetails}
          className="block aspect-[4/3] w-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label={`View ${listing.title}`}
        >
          <HbImage
            src={listing.image}
            alt={`${listing.subject} class`}
            priority={priority}
            className="h-full w-full"
            imgClassName="group-hover:scale-[1.04]"
          />
        </button>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="pointer-events-auto rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
            {listing.category}
          </span>
          <button
            type="button"
            onClick={() => toggleSave(listing.id)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save class'}
            className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Bookmark
              className={cn('size-4', saved && 'fill-primary text-primary')}
              aria-hidden="true"
            />
          </button>
        </div>

        {listing.beginnerFriendly && (
          <span className="absolute bottom-3 left-3 rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-sage-foreground">
            Beginner friendly
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <button
          type="button"
          onClick={openDetails}
          className="text-left outline-none focus-visible:underline"
        >
          <h3 className="font-serif text-lg leading-snug font-semibold text-balance">
            {listing.title}
          </h3>
        </button>

        <p className="text-sm text-muted-foreground">{listing.provider}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {listing.neighborhood}
          </span>
          <span className="font-medium text-foreground">
            {formatPrice(listing.pricePerPerson)}
            <span className="font-normal text-muted-foreground"> / person</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          <span>
            Next: {formatDate(nextSession.date)} · {nextSession.time}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3.5" aria-hidden="true" />
            {listing.interestedCount} interested
          </span>
          <Button
            size="sm"
            onClick={() =>
              nav.navigate({ view: 'buddies', contextClassId: listing.id })
            }
          >
            Find a buddy
          </Button>
        </div>
      </div>
    </article>
  )
}
