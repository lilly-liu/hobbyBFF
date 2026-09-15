'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { TimeOfDay } from '@/lib/types'
import {
  DEFAULT_FILTERS,
  MAX_BUDGET,
  countActiveFilters,
  type Filters,
} from '@/lib/filters'
import { DATE_RANGES, NEIGHBORHOODS } from '@/lib/mock-data'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ChoiceChip } from '@/components/shared/choice-chip'
import { formatPrice } from '@/lib/format'

const TIMES: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening']

function FieldGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      {children}
    </div>
  )
}

export function DiscoverFilters({
  filters,
  onChange,
  resultCount,
}: {
  filters: Filters
  onChange: (next: Filters) => void
  resultCount: number
}) {
  const [open, setOpen] = useState(false)
  const active = countActiveFilters(filters)

  function toggleTime(t: TimeOfDay) {
    onChange({
      ...filters,
      timesOfDay: filters.timesOfDay.includes(t)
        ? filters.timesOfDay.filter((x) => x !== t)
        : [...filters.timesOfDay, t],
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        }
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters
        {active > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {active}
          </span>
        )}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="mx-auto max-h-[85dvh] rounded-t-3xl sm:max-w-lg"
      >
        <SheetHeader className="border-b border-border px-5 pt-5 pb-4">
          <SheetTitle className="font-serif text-xl">Fine-tune your search</SheetTitle>
          <SheetDescription>
            When are you free, and how far are you willing to roam?
          </SheetDescription>
        </SheetHeader>

        <div className="hb-scroll flex flex-col gap-6 overflow-y-auto px-5 py-5">
          <FieldGroup label="When">
            <div className="flex flex-wrap gap-2">
              {DATE_RANGES.map((r) => (
                <ChoiceChip
                  key={r}
                  label={r}
                  selected={filters.dateRange === r}
                  onClick={() => onChange({ ...filters, dateRange: r })}
                />
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label="Time of day">
            <div className="flex flex-wrap gap-2">
              {TIMES.map((t) => (
                <ChoiceChip
                  key={t}
                  label={t}
                  selected={filters.timesOfDay.includes(t)}
                  onClick={() => toggleTime(t)}
                  showCheck
                />
              ))}
            </div>
          </FieldGroup>

          <FieldGroup label={`Budget — up to ${formatPrice(filters.budget)} per person`}>
            <Slider
              value={[filters.budget]}
              min={15}
              max={MAX_BUDGET}
              step={5}
              onValueChange={(v) =>
                onChange({
                  ...filters,
                  budget: Array.isArray(v) ? v[0] : v,
                })
              }
              aria-label="Maximum budget per person"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$15</span>
              <span>${MAX_BUDGET}+</span>
            </div>
          </FieldGroup>

          <FieldGroup label="Neighborhood">
            <div className="flex flex-wrap gap-2">
              {NEIGHBORHOODS.map((n) => (
                <ChoiceChip
                  key={n}
                  label={n}
                  selected={filters.neighborhood === n}
                  onClick={() => onChange({ ...filters, neighborhood: n })}
                />
              ))}
            </div>
          </FieldGroup>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-4">
            <Label htmlFor="beginner-switch" className="flex flex-col gap-0.5">
              <span className="font-medium">Beginner friendly only</span>
              <span className="text-sm font-normal text-muted-foreground">
                Classes made for first-timers
              </span>
            </Label>
            <Switch
              id="beginner-switch"
              checked={filters.beginnerOnly}
              onCheckedChange={(checked) =>
                onChange({ ...filters, beginnerOnly: checked })
              }
            />
          </div>
        </div>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t border-border px-5 py-4">
          <Button
            variant="ghost"
            onClick={() =>
              onChange({
                ...DEFAULT_FILTERS,
                query: filters.query,
                category: filters.category,
              })
            }
          >
            Reset
          </Button>
          <SheetClose
            render={<Button className="h-10 flex-1 sm:flex-none sm:px-8" />}
          >
            Show {resultCount} {resultCount === 1 ? 'class' : 'classes'}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
