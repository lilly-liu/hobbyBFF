'use client'

import { MapPin, CalendarPlus } from 'lucide-react'
import type { ClassListing } from '@/lib/types'
import { useNav } from '@/lib/navigation'
import { formatPrice } from '@/lib/format'
import { HbImage } from '@/components/shared/hb-image'

export function SharedClassHeader({
  listing,
  onSuggest,
}: {
  listing: ClassListing
  onSuggest: () => void
}) {
  const nav = useNav()
  return (
    <div className="flex items-center gap-3 border-b border-border bg-muted/40 p-3">
      <button
        type="button"
        onClick={() => nav.navigate({ view: 'class', classId: listing.id })}
        className="size-12 shrink-0 overflow-hidden rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label={`View ${listing.title}`}
      >
        <HbImage src={listing.image} alt={listing.title} className="h-full w-full" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium tracking-wide text-primary uppercase">
          Trying together
        </p>
        <p className="truncate font-serif text-sm font-semibold">{listing.title}</p>
        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
          <MapPin className="size-3" aria-hidden="true" />
          {listing.neighborhood} · {formatPrice(listing.pricePerPerson)}/person
        </p>
      </div>
      <button
        type="button"
        onClick={onSuggest}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <CalendarPlus className="size-3.5" aria-hidden="true" />
        Suggest a session
      </button>
    </div>
  )
}
