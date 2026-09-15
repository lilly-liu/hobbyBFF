'use client'

import { useMemo } from 'react'
import { CalendarDays, MapPin, Clock, Users, Compass } from 'lucide-react'
import { useDemo, getClass, getBuddy } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { HbImage } from '@/components/shared/hb-image'
import { formatDateLong } from '@/lib/format'
import type { SessionProposal } from '@/lib/types'

interface PlanEntry {
  buddyId: string
  proposal: SessionProposal
}

export function PlansView() {
  const { conversations } = useDemo()
  const { navigate } = useNav()

  const { upcoming, past } = useMemo(() => {
    const confirmed: PlanEntry[] = []
    for (const convo of Object.values(conversations)) {
      for (const m of convo.messages) {
        if (
          m.kind === 'proposal' &&
          (m.proposal?.status === 'agreed' ||
            m.proposal?.status === 'booking_pending')
        ) {
          confirmed.push({ buddyId: convo.buddyId, proposal: m.proposal })
        }
      }
    }
    confirmed.sort(
      (a, b) =>
        new Date(a.proposal.date).getTime() -
        new Date(b.proposal.date).getTime(),
    )
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const upcoming = confirmed.filter(
      (e) => new Date(e.proposal.date).getTime() >= todayStart.getTime(),
    )
    const past = confirmed
      .filter((e) => new Date(e.proposal.date).getTime() < todayStart.getTime())
      .reverse()
    return { upcoming, past }
  }, [conversations])

  const hasPlans = upcoming.length > 0 || past.length > 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          My plans
        </h1>
        <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
          Every session you and a buddy have locked in. Confirm a proposal in
          Messages and it lands here.
        </p>
      </header>

      {!hasPlans && (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <CalendarDays className="size-5" aria-hidden="true" />
          </div>
          <h2 className="font-serif text-xl font-medium text-foreground">
            No plans yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            Match with a buddy, agree on a class, and confirm a time together.
            Your first adventure is one message away.
          </p>
          <button
            type="button"
            onClick={() => navigate({ view: 'buddies' })}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Compass className="size-4" aria-hidden="true" />
            Find a buddy
          </button>
        </div>
      )}

      {upcoming.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Upcoming
          </h2>
          <div className="flex flex-col gap-4">
            {upcoming.map((entry) => (
              <PlanCard key={entry.proposal.id} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Past sessions
          </h2>
          <div className="flex flex-col gap-4">
            {past.map((entry) => (
              <PlanCard key={entry.proposal.id} entry={entry} past />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PlanCard({ entry, past }: { entry: PlanEntry; past?: boolean }) {
  const { navigate } = useNav()
  const klass = getClass(entry.proposal.classId)
  const buddy = getBuddy(entry.buddyId)
  if (!klass || !buddy) return null

  return (
    <article
      className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md ${
        past ? 'opacity-80' : ''
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative h-32 w-full shrink-0 sm:h-auto sm:w-40">
          <HbImage
            src={klass.image}
            alt={klass.title}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">
              {klass.category}
            </p>
            <h3 className="mt-1 font-serif text-lg font-medium leading-snug text-foreground">
              {klass.title}
            </h3>
          </div>

          <dl className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
              <dd>{formatDateLong(entry.proposal.date)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              <dd>{entry.proposal.time}</dd>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <dd>{entry.proposal.location}</dd>
            </div>
          </dl>

          <div className="mt-1 flex items-center justify-between border-t border-border/70 pt-3">
            <button
              type="button"
              onClick={() => navigate({ view: 'messages', buddyId: buddy.id })}
              className="flex items-center gap-2 rounded-md text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="relative flex size-7 overflow-hidden rounded-full">
                <HbImage
                  src={buddy.photo}
                  alt=""
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              with {buddy.firstName}
            </button>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <Users className="size-3.5" aria-hidden="true" />
              {past
                ? 'Completed'
                : entry.proposal.status === 'booking_pending'
                  ? 'Booking'
                  : 'Agreed'}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
