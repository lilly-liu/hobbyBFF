'use client'

import { CATEGORIES } from '@/lib/mock-data'
import type { Category } from '@/lib/types'
import { cn } from '@/lib/utils'

export function CategoryTabs({
  value,
  onChange,
}: {
  value: Category | 'All'
  onChange: (c: Category | 'All') => void
}) {
  return (
    <div
      className="hb-scroll -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0"
      role="tablist"
      aria-label="Class categories"
    >
      {CATEGORIES.map((c) => {
        const active = value === c
        return (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c)}
            className={cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
              active
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-foreground hover:border-foreground/30 hover:bg-muted',
            )}
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}
