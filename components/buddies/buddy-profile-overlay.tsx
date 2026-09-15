'use client'

import { useEffect } from 'react'
import {
  X,
  Heart,
  MapPin,
  Sparkles,
  CalendarClock,
  Coffee,
  Compass,
} from 'lucide-react'
import type { Buddy, ClassListing } from '@/lib/types'
import { HbImage } from '@/components/shared/hb-image'
import { Button } from '@/components/ui/button'
import { InterestTags } from '@/components/buddies/interest-tags'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-border px-5 py-5 md:px-6">
      <h3 className="mb-3 font-serif text-lg font-semibold">{title}</h3>
      {children}
    </section>
  )
}

export function BuddyProfileOverlay({
  buddy,
  contextClass,
  onClose,
  onPass,
  onLike,
}: {
  buddy: Buddy
  contextClass?: ClassListing
  onClose: () => void
  onPass: () => void
  onLike: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${buddy.firstName}'s full profile`}
    >
      <button
        type="button"
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      <div className="hb-scroll relative flex w-full max-w-lg flex-col overflow-y-auto bg-background pb-24 sm:max-h-[88dvh] sm:rounded-3xl sm:pb-0 sm:shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground backdrop-blur transition-colors hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <X className="size-4.5" aria-hidden="true" />
        </button>

        <div className="relative">
          <HbImage
            src={buddy.photo}
            alt={buddy.firstName}
            priority
            className="aspect-[4/5] w-full sm:aspect-[3/2]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16 text-white">
            {contextClass && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="size-3" aria-hidden="true" />
                Wants to try {contextClass.subject}
              </span>
            )}
            <h2 className="font-serif text-3xl font-semibold">
              {buddy.firstName}, {buddy.age}
            </h2>
            <p className="flex items-center gap-1.5 text-sm text-white/85">
              <MapPin className="size-3.5" aria-hidden="true" />
              {buddy.neighborhood}
            </p>
          </div>
        </div>

        <div className="bg-primary/8 px-5 py-4 md:px-6">
          <p className="flex items-start gap-2 text-sm font-medium text-foreground text-pretty">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            {buddy.reason}
          </p>
        </div>

        <div className="px-5 py-5 md:px-6">
          <p className="font-serif text-xl leading-snug text-balance">
            &ldquo;{buddy.headlinePrompt}&rdquo;
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/90 text-pretty">
            {buddy.bio}
          </p>
        </div>

        <Section title="A little more">
          <div className="flex flex-col gap-4">
            {buddy.prompts.map((p) => (
              <div key={p.q}>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {p.q}
                </p>
                <p className="mt-1 text-[15px] text-foreground/90 text-pretty">{p.a}</p>
              </div>
            ))}
          </div>
        </Section>

        {buddy.gallery.length > 0 && (
          <Section title="Things they’re into">
            <div className="grid grid-cols-3 gap-2">
              {buddy.gallery.map((src, i) => (
                <HbImage
                  key={src + i}
                  src={src}
                  alt={`${buddy.firstName}'s interest`}
                  className="aspect-square w-full rounded-xl"
                />
              ))}
            </div>
          </Section>
        )}

        <Section title="Interests">
          <InterestTags interests={buddy.interests} shared={buddy.sharedInterests} />
          <p className="mt-2 text-xs text-muted-foreground">
            Highlighted ones you have in common.
          </p>
        </Section>

        <Section title="When they’re free">
          <div className="flex flex-wrap gap-1.5">
            {buddy.availability.map((a) => (
              <span
                key={a}
                className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium"
              >
                {a}
              </span>
            ))}
          </div>
        </Section>

        <Section title="How they like to hang">
          <div className="flex flex-col gap-3 text-[15px]">
            <p className="flex items-center gap-2">
              <Coffee className="size-4 text-primary" aria-hidden="true" />
              <span className="text-foreground/90">
                Ideal first hangout: {buddy.socialPace}
              </span>
            </p>
            <p className="flex items-start gap-2">
              <Compass className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-foreground/90 text-pretty">{buddy.intentions}</span>
            </p>
          </div>
        </Section>

        <div className="sticky bottom-0 mt-auto flex items-center gap-3 border-t border-border bg-background/95 p-4 backdrop-blur">
          <Button
            variant="outline"
            size="lg"
            className="h-12 flex-1 text-sm"
            onClick={() => {
              onPass()
              onClose()
            }}
          >
            <X aria-hidden="true" />
            Pass
          </Button>
          <Button
            size="lg"
            className="h-12 flex-1 text-sm"
            onClick={() => {
              onLike()
              onClose()
            }}
          >
            <Heart className="fill-current" aria-hidden="true" />
            Interested
          </Button>
        </div>
      </div>
    </div>
  )
}
