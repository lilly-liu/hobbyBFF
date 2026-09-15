'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import { useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { Wordmark } from '@/components/shared/wordmark'
import { ChoiceChip } from '@/components/shared/choice-chip'
import { HbImage } from '@/components/shared/hb-image'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { SAMPLE_PHOTOS } from '@/lib/mock-data'
import type { Category, UserProfile } from '@/lib/types'

const HOBBIES: Category[] = [
  'Pottery',
  'Cooking',
  'Dance',
  'Climbing',
  'Art',
  'Outdoors',
]
const AVAILABILITY = [
  'Weekday mornings',
  'Weekday evenings',
  'Saturday afternoons',
  'Sunday afternoons',
  'Weekend mornings',
]
const PACES = [
  'Just the class, low pressure',
  'Coffee or a walk afterward',
  'See how it goes',
]
const GENDER_PREFS = ['Open to everyone', 'Women', 'Men', 'Nonbinary folks']

const STEPS = ['Hobbies', 'When', 'Your buddy', 'About you'] as const

export function OnboardingView() {
  const { profile, completeOnboarding } = useDemo()
  const { navigate } = useNav()

  const [step, setStep] = useState(0)
  const [hobbies, setHobbies] = useState<Category[]>(profile.hobbies)
  const [availability, setAvailability] = useState<string[]>(
    profile.availability,
  )
  const [budget, setBudget] = useState(profile.budget)
  const [ageRange, setAgeRange] = useState<[number, number]>(
    profile.buddyAgeRange,
  )
  const [genderPreference, setGenderPreference] = useState(
    profile.genderPreference,
  )
  const [pace, setPace] = useState(PACES[1])
  const [name, setName] = useState(profile.name === 'You' ? '' : profile.name)
  const [neighborhood, setNeighborhood] = useState(profile.neighborhood)
  const [photo, setPhoto] = useState(profile.photo)

  function toggle<T>(list: T[], value: T): T[] {
    return list.includes(value)
      ? list.filter((v) => v !== value)
      : [...list, value]
  }

  const canProceed =
    step === 0
      ? hobbies.length > 0
      : step === 1
        ? availability.length > 0
        : step === 3
          ? name.trim().length > 0
          : true

  function finish() {
    const next: UserProfile = {
      ...profile,
      name: name.trim() || 'You',
      neighborhood,
      photo,
      hobbies,
      availability,
      budget,
      buddyAgeRange: ageRange,
      genderPreference,
    }
    completeOnboarding(next)
    navigate({ view: 'discover' })
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-8 md:py-12">
        <header className="mb-8">
          <div className="mb-8 flex items-center justify-between">
            <Wordmark className="text-xl" />
            <button
              type="button"
              onClick={() => navigate({ view: 'discover' })}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
          <div className="flex items-center gap-2" aria-hidden="true">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Step {step + 1} of {STEPS.length} · {STEPS[step]}
          </p>
        </header>

        <div className="flex-1">
          {step === 0 && (
            <StepShell
              title="What do you want to try?"
              subtitle="Pick anything that sparks curiosity. We’ll match you with classes and people around these."
            >
              <div className="flex flex-wrap gap-2.5">
                {HOBBIES.map((h) => (
                  <ChoiceChip
                    key={h}
                    selected={hobbies.includes(h)}
                    onClick={() => setHobbies((prev) => toggle(prev, h))}
                  >
                    {h}
                  </ChoiceChip>
                ))}
              </div>
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              title="When are you usually free?"
              subtitle="We’ll prioritize buddies and sessions that fit your rhythm."
            >
              <div className="flex flex-wrap gap-2.5">
                {AVAILABILITY.map((a) => (
                  <ChoiceChip
                    key={a}
                    selected={availability.includes(a)}
                    onClick={() => setAvailability((prev) => toggle(prev, a))}
                  >
                    {a}
                  </ChoiceChip>
                ))}
              </div>
              <div className="mt-8">
                <div className="mb-3 flex items-baseline justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Comfortable spend per class
                  </label>
                  <span className="font-serif text-lg text-primary">
                    ${budget}
                  </span>
                </div>
                <Slider
                  value={[budget]}
                  min={20}
                  max={150}
                  step={5}
                  onValueChange={(v) => setBudget(typeof v === 'number' ? v : v[0])}
                  aria-label="Budget per class"
                />
                <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>$20</span>
                  <span>$150+</span>
                </div>
              </div>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              title="Who’s your ideal buddy?"
              subtitle="This stays flexible — it just helps us make warmer introductions."
            >
              <div className="mb-8">
                <div className="mb-3 flex items-baseline justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Age range
                  </label>
                  <span className="font-serif text-lg text-primary">
                    {ageRange[0]}–{ageRange[1]}
                  </span>
                </div>
                <Slider
                  value={ageRange}
                  min={18}
                  max={65}
                  step={1}
                  onValueChange={(v) =>
                    typeof v !== 'number' && setAgeRange([v[0], v[1]])
                  }
                  aria-label="Preferred buddy age range"
                />
              </div>

              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Open to meeting
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {GENDER_PREFS.map((g) => (
                    <ChoiceChip
                      key={g}
                      selected={genderPreference === g}
                      onClick={() => setGenderPreference(g)}
                    >
                      {g}
                    </ChoiceChip>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-foreground">
                  Your social pace
                </p>
                <div className="flex flex-col gap-2.5">
                  {PACES.map((p) => (
                    <ChoiceChip
                      key={p}
                      selected={pace === p}
                      onClick={() => setPace(p)}
                      className="justify-start"
                    >
                      {p}
                    </ChoiceChip>
                  ))}
                </div>
              </div>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell
              title="Last thing — introduce yourself"
              subtitle="This is what potential buddies will see first."
            >
              <div className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="ob-name"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    First name
                  </label>
                  <input
                    id="ob-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <div>
                  <label
                    htmlFor="ob-hood"
                    className="mb-1.5 block text-sm font-medium text-foreground"
                  >
                    Neighborhood
                  </label>
                  <input
                    id="ob-hood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Cambridge"
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-foreground">
                    Pick a profile photo
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {SAMPLE_PHOTOS.map((p) => {
                      const active = p === photo
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPhoto(p)}
                          aria-pressed={active}
                          aria-label="Select this photo"
                          className={`relative size-16 overflow-hidden rounded-full ring-offset-2 ring-offset-background transition-all focus-visible:outline-none ${
                            active
                              ? 'ring-3 ring-primary'
                              : 'ring-1 ring-border hover:ring-muted-foreground'
                          }`}
                        >
                          <HbImage
                            src={p}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                          {active && (
                            <span className="absolute inset-0 flex items-center justify-center bg-primary/25">
                              <Check
                                className="size-5 text-primary-foreground"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </StepShell>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              className="h-11"
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft aria-hidden="true" />
              Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              className="h-11 flex-1"
              disabled={!canProceed}
              onClick={() => setStep((s) => s + 1)}
            >
              Continue
              <ArrowRight aria-hidden="true" />
            </Button>
          ) : (
            <Button
              className="h-11 flex-1"
              disabled={!canProceed}
              onClick={finish}
            >
              <Sparkles aria-hidden="true" />
              See my matches
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h1 className="text-balance font-serif text-3xl font-medium leading-tight tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-pretty leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
      <div className="mt-7">{children}</div>
    </div>
  )
}
