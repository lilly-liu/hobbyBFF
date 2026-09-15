'use client'

import { useState } from 'react'
import {
  MapPin,
  Sparkles,
  Wallet,
  CalendarClock,
  Users,
  RotateCcw,
  Pencil,
} from 'lucide-react'
import { useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { HbImage } from '@/components/shared/hb-image'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function ProfileView() {
  const { profile, matchedBuddyIds, savedClassIds, resetDemo } = useDemo()
  const { navigate } = useNav()
  const [resetOpen, setResetOpen] = useState(false)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-10">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="h-28 bg-gradient-to-r from-primary/15 via-butter/30 to-sage/25" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="relative size-24 overflow-hidden rounded-full ring-4 ring-card">
              <HbImage
                src={profile.photo}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ view: 'onboarding' })}
            >
              <Pencil aria-hidden="true" />
              Edit
            </Button>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-foreground">
            {profile.name}
            {profile.name !== 'You' ? `, ${profile.age}` : ''}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4" aria-hidden="true" />
            {profile.neighborhood}, Boston
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat
          icon={Sparkles}
          label="Matches"
          value={String(matchedBuddyIds.length)}
        />
        <Stat
          icon={CalendarClock}
          label="Saved classes"
          value={String(savedClassIds.length)}
        />
        <Stat icon={Wallet} label="Budget" value={`$${profile.budget}`} />
      </div>

      <Section title="Hobbies I want to try">
        <div className="flex flex-wrap gap-2">
          {profile.hobbies.map((h) => (
            <span
              key={h}
              className="rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground"
            >
              {h}
            </span>
          ))}
        </div>
      </Section>

      <Section title="When I’m free">
        <div className="flex flex-wrap gap-2">
          {profile.availability.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground"
            >
              {a}
            </span>
          ))}
        </div>
      </Section>

      <Section title="My buddy preferences">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
              Age range
            </dt>
            <dd className="font-medium text-foreground">
              {profile.buddyAgeRange[0]}–{profile.buddyAgeRange[1]}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="size-4" aria-hidden="true" />
              Open to meeting
            </dt>
            <dd className="font-medium text-foreground">
              {profile.genderPreference}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="A little about me">
        <div className="flex flex-col gap-4">
          {profile.prompts.map((p) => (
            <div key={p.q}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {p.q}
              </p>
              <p className="mt-1 font-serif text-lg text-foreground">{p.a}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/40 p-5">
        <p className="text-sm font-medium text-foreground">Demo controls</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          This is a clickable prototype. Reset to clear your saved classes,
          matches, and messages and start the walkthrough fresh.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setResetOpen(true)}
        >
          <RotateCcw aria-hidden="true" />
          Reset demo
        </Button>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogTitle className="font-serif text-xl">
            Reset the demo?
          </DialogTitle>
          <DialogDescription>
            This clears saved classes, matches, and conversations, returning the
            prototype to its starting state.
          </DialogDescription>
          <div className="mt-2 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setResetOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                resetDemo()
                setResetOpen(false)
                navigate({ view: 'discover' })
              }}
            >
              Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Sparkles
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      <p className="mt-2 font-serif text-2xl font-medium text-foreground">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}
