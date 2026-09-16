'use client'

import { useMemo, useState } from 'react'
import { Search, Sparkles, X } from 'lucide-react'
import { CLASSES } from '@/lib/mock-data'
import { useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { applyFilters, DEFAULT_FILTERS, type Filters } from '@/lib/filters'
import { Button } from '@/components/ui/button'
import { CategoryTabs } from '@/components/discover/category-tabs'
import { DiscoverFilters } from '@/components/discover/discover-filters'
import { LocationDialog } from '@/components/discover/location-dialog'
import { AddLinkDialog } from '@/components/discover/add-link-dialog'
import { ClassCard } from '@/components/discover/class-card'
import { cn } from '@/lib/utils'

type Intent = 'class' | 'hobby'

export function DiscoverView() {
  const { location } = useDemo()
  const nav = useNav()
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [intent, setIntent] = useState<Intent>('class')

  const results = useMemo(() => applyFilters(CLASSES, filters), [filters])

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <section className="pt-6 pb-5 md:pt-12 md:pb-8">
        <div className="flex items-center justify-between gap-3">
          <LocationDialog />
          <button
            type="button"
            onClick={() => nav.navigate({ view: 'onboarding' })}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-primary hover:underline md:hidden"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Personalize
          </button>
        </div>

        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.05] font-semibold tracking-tight text-balance md:text-6xl">
          Your next first, together.
        </h1>
        <p className="mt-3 max-w-xl text-base text-muted-foreground text-pretty md:text-lg">
          Discover something you&apos;d love to try in {location.split(',')[0]}. Find
          someone to try it with.
        </p>

        <div
          className="mt-6 inline-flex rounded-full border border-border bg-card p-1"
          role="group"
          aria-label="What are you looking for"
        >
          {(
            [
              { key: 'class', label: 'A class I’ve picked' },
              { key: 'hobby', label: 'A hobby, sometime soon' },
            ] as { key: Intent; label: string }[]
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              aria-pressed={intent === opt.key}
              onClick={() => setIntent(opt.key)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                intent === opt.key
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder={
                intent === 'class'
                  ? 'Search a class, studio, or neighborhood'
                  : 'Search a hobby you’d love to try'
              }
              aria-label="Search hobbies or classes"
              className="h-14 w-full rounded-2xl border border-border bg-card pr-4 pl-12 text-base shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, query: '' })}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground text-pretty">
              {intent === 'class'
                ? 'Pick a specific workshop and bring someone along.'
                : 'Not sure yet? Explore, save a few, and decide together.'}
            </p>
            <AddLinkDialog />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-border/70 py-4">
        <div className="min-w-0 flex-1">
          <CategoryTabs
            value={filters.category}
            onChange={(c) => setFilters({ ...filters, category: c })}
          />
        </div>
        <DiscoverFilters
          filters={filters}
          onChange={setFilters}
          resultCount={results.length}
        />
      </div>

      <div className="flex items-baseline justify-between gap-3 pb-4">
        <h2 className="font-serif text-lg font-semibold">
          {results.length} {results.length === 1 ? 'class' : 'classes'}
          <span className="ml-1 font-sans text-sm font-normal text-muted-foreground">
            in {location.split(',')[0]}
          </span>
        </h2>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((listing, i) => (
            <ClassCard key={listing.id} listing={listing} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mb-16 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <p className="font-serif text-xl font-semibold">Nothing matches just yet</p>
          <p className="max-w-sm text-sm text-muted-foreground text-pretty">
            Try different dates, a higher budget, or another neighborhood.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              setFilters({
                ...DEFAULT_FILTERS,
                query: filters.query,
                category: filters.category,
              })
            }
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
