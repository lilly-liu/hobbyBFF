'use client'

import { Compass, Users, MessageCircle, CalendarDays, User } from 'lucide-react'
import { useNav, type View } from '@/lib/navigation'
import { cn } from '@/lib/utils'

const ITEMS: { view: View; label: string; icon: typeof Compass }[] = [
  { view: 'discover', label: 'Discover', icon: Compass },
  { view: 'buddies', label: 'Buddies', icon: Users },
  { view: 'messages', label: 'Messages', icon: MessageCircle },
  { view: 'plans', label: 'Plans', icon: CalendarDays },
  { view: 'profile', label: 'Profile', icon: User },
]

function rootOf(view: View): View {
  if (view === 'class') return 'discover'
  if (view === 'onboarding') return 'profile'
  return view
}

export function BottomNav() {
  const nav = useNav()
  const activeRoot = rootOf(nav.view)

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2">
        {ITEMS.map((item) => {
          const active = activeRoot === item.view
          const Icon = item.icon
          return (
            <li key={item.view} className="flex-1">
              <button
                type="button"
                onClick={() => nav.navigate({ view: item.view })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-lg px-1 pt-2 pb-1.5 text-[11px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                    active && 'bg-primary/12',
                  )}
                >
                  <Icon
                    className="size-5"
                    strokeWidth={active ? 2.4 : 2}
                    aria-hidden="true"
                  />
                </span>
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
