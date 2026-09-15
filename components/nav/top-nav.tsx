'use client'

import { Compass, Users, MessageCircle, CalendarDays, User, Sparkles } from 'lucide-react'
import { useNav, type View } from '@/lib/navigation'
import { Wordmark } from '@/components/shared/wordmark'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ITEMS: { view: View; label: string; icon: typeof Compass }[] = [
  { view: 'discover', label: 'Discover', icon: Compass },
  { view: 'buddies', label: 'Buddies', icon: Users },
  { view: 'messages', label: 'Messages', icon: MessageCircle },
  { view: 'plans', label: 'My Plans', icon: CalendarDays },
  { view: 'profile', label: 'Profile', icon: User },
]

function rootOf(view: View): View {
  if (view === 'class') return 'discover'
  if (view === 'onboarding') return 'profile'
  return view
}

export function TopNav() {
  const nav = useNav()
  const activeRoot = rootOf(nav.view)

  return (
    <header className="sticky top-0 z-40 hidden border-b border-border/70 bg-background/85 backdrop-blur md:block">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <button
          type="button"
          onClick={() => nav.navigate({ view: 'discover' })}
          className="rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="hobbyBFF home"
        >
          <Wordmark />
        </button>

        <nav aria-label="Primary" className="flex items-center gap-1">
          {ITEMS.map((item) => {
            const active = activeRoot === item.view
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => nav.navigate({ view: item.view })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-[1px] h-0.5 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => nav.navigate({ view: 'onboarding' })}
          >
            <Sparkles className="text-primary" />
            Personalize your matches
          </Button>
        </div>
      </div>
    </header>
  )
}
