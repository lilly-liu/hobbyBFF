import type { Category, ClassListing, TimeOfDay } from './types'

export interface Filters {
  query: string
  category: Category | 'All'
  dateRange: string
  timesOfDay: TimeOfDay[]
  budget: number
  neighborhood: string
  beginnerOnly: boolean
}

export const MAX_BUDGET = 100

export const DEFAULT_FILTERS: Filters = {
  query: '',
  category: 'All',
  dateRange: 'I’m flexible',
  timesOfDay: [],
  budget: MAX_BUDGET,
  neighborhood: 'Any neighborhood',
  beginnerOnly: false,
}

// Fixed reference point so the demo's future dates stay deterministic.
const DEMO_TODAY = new Date('2026-09-14T00:00:00')

function withinRange(iso: string, range: string): boolean {
  if (range === 'I’m flexible') return true
  const d = new Date(iso)
  const days = (d.getTime() - DEMO_TODAY.getTime()) / (1000 * 60 * 60 * 24)
  if (days < 0) return false
  if (range === 'This week') return days <= 7
  if (range === 'Next 2 weeks') return days <= 14
  if (range === 'This month') return days <= 31
  return true
}

export function countActiveFilters(f: Filters): number {
  let n = 0
  if (f.dateRange !== DEFAULT_FILTERS.dateRange) n++
  if (f.timesOfDay.length) n++
  if (f.budget !== MAX_BUDGET) n++
  if (f.neighborhood !== DEFAULT_FILTERS.neighborhood) n++
  if (f.beginnerOnly) n++
  return n
}

export function applyFilters(
  classes: ClassListing[],
  f: Filters,
): ClassListing[] {
  const q = f.query.trim().toLowerCase()
  return classes.filter((c) => {
    if (f.category !== 'All' && c.category !== f.category) return false
    if (
      f.neighborhood !== 'Any neighborhood' &&
      c.neighborhood !== f.neighborhood
    )
      return false
    if (c.pricePerPerson > f.budget) return false
    if (f.beginnerOnly && !c.beginnerFriendly) return false
    if (q) {
      const haystack =
        `${c.title} ${c.subject} ${c.provider} ${c.category} ${c.neighborhood}`.toLowerCase()
      if (!haystack.includes(q)) return false
    }
    if (f.timesOfDay.length) {
      const hasTime = c.sessions.some((s) => f.timesOfDay.includes(s.timeOfDay))
      if (!hasTime) return false
    }
    const inRange = c.sessions.some((s) => withinRange(s.date, f.dateRange))
    if (!inRange) return false
    return true
  })
}
