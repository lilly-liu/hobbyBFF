'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Clock,
  Users,
  Check,
  Info,
  CalendarDays,
} from 'lucide-react'
import { BUDDIES } from '@/lib/mock-data'
import { getClass, useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { formatDateLong, formatDuration, formatPrice } from '@/lib/format'
import { HbImage } from '@/components/shared/hb-image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
          <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-sage/25 text-sage-foreground">
            <Check className="size-3" aria-hidden="true" />
          </span>
          <span className="text-foreground/90">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ClassDetailsView({ classId }: { classId?: string }) {
  const nav = useNav()
  const { isSaved, toggleSave } = useDemo()
  const listing = classId ? getClass(classId) : undefined
  const [selectedSession, setSelectedSession] = useState(
    listing?.sessions[0]?.id ?? '',
  )

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="font-serif text-xl">We couldn&apos;t find that class.</p>
        <Button className="mt-4" onClick={() => nav.navigate({ view: 'discover' })}>
          Back to Discover
        </Button>
      </div>
    )
  }

  const saved = isSaved(listing.id)
  const interestedBuddies = BUDDIES.filter(
    (b) => b.wantsToTryClassId === listing.id,
  )

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 md:px-6 md:pt-6">
      <button
        type="button"
        onClick={() => (nav.canGoBack ? nav.goBack() : nav.navigate({ view: 'discover' }))}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-border">
        <HbImage
          src={listing.image}
          alt={`${listing.subject} class`}
          priority
          className="aspect-[16/10] w-full md:aspect-[21/9]"
        />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between">
          <div className="flex gap-2">
            <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
              {listing.category}
            </span>
            {listing.beginnerFriendly && (
              <span className="rounded-full bg-sage px-3 py-1 text-xs font-medium text-sage-foreground">
                Beginner friendly
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => toggleSave(listing.id)}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save class'}
            className="flex size-10 items-center justify-center rounded-full bg-background/90 backdrop-blur transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Bookmark
              className={cn('size-4.5', saved && 'fill-primary text-primary')}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary">{listing.provider}</p>
          <h1 className="mt-1 font-serif text-3xl leading-tight font-semibold text-balance md:text-4xl">
            {listing.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {listing.neighborhood}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" aria-hidden="true" />
              {formatDuration(listing.durationMins)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              {listing.level}
            </span>
          </div>

          <p className="mt-5 max-w-prose text-lg leading-relaxed text-foreground/90 text-pretty">
            {listing.blurb}
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <section>
              <h2 className="font-serif text-xl font-semibold">What you&apos;ll do</h2>
              <div className="mt-3">
                <InfoList items={listing.whatYoullDo} />
              </div>
            </section>
            <section>
              <h2 className="font-serif text-xl font-semibold">What&apos;s included</h2>
              <div className="mt-3">
                <InfoList items={listing.included} />
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5">
            <h2 className="font-serif text-lg font-semibold">Experience needed</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/90 text-pretty">
              {listing.requirements}
            </p>
          </section>

          <section className="mt-8">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold">Sample sessions</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Pick one you like to plan around. These are scheduled times, not held
              seats.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              {listing.sessions.map((s) => {
                const active = selectedSession === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSession(s.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                      active
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:border-foreground/30',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <CalendarDays
                        className={cn(
                          'size-5',
                          active ? 'text-primary' : 'text-muted-foreground',
                        )}
                        aria-hidden="true"
                      />
                      <span>
                        <span className="block font-medium">
                          {formatDateLong(s.date)}
                        </span>
                        <span className="block text-sm text-muted-foreground">
                          {s.time} · {s.timeOfDay}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        'flex size-5 items-center justify-center rounded-full border',
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border',
                      )}
                    >
                      {active && <Check className="size-3" aria-hidden="true" />}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-butter/25 px-3 py-2.5 text-xs text-butter-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              This is a sample class. No seats are reserved through this demo.
            </p>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-semibold">
              People hoping to try this
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex -space-x-3">
                {(interestedBuddies.length ? interestedBuddies : BUDDIES.slice(0, 4))
                  .slice(0, 5)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="size-10 overflow-hidden rounded-full border-2 border-card"
                    >
                      <HbImage src={b.photo} alt={b.firstName} className="h-full w-full" />
                    </div>
                  ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {listing.interestedCount} people are interested in {listing.subject}.
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-semibold">
                {formatPrice(listing.pricePerPerson)}
              </span>
              <span className="text-sm text-muted-foreground">per person</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              You each pay the provider directly.
            </p>
            <Button
              size="lg"
              className="mt-4 h-12 w-full text-sm"
              onClick={() =>
                nav.navigate({ view: 'buddies', contextClassId: listing.id })
              }
            >
              Find a buddy for this class
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="mt-2 h-11 w-full text-sm"
              onClick={() => toggleSave(listing.id)}
            >
              <Bookmark
                className={cn(saved && 'fill-primary text-primary')}
                aria-hidden="true"
              />
              {saved ? 'Saved' : 'Save for later'}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
