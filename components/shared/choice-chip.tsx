'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChoiceChipProps {
  label?: string
  children?: React.ReactNode
  selected: boolean
  onClick: () => void
  showCheck?: boolean
  className?: string
}

export function ChoiceChip({
  label,
  children,
  selected,
  onClick,
  showCheck = false,
  className,
}: ChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px',
        selected
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-card text-foreground hover:border-foreground/30 hover:bg-muted',
        className,
      )}
    >
      {showCheck && selected && <Check className="size-3.5" aria-hidden="true" />}
      {children ?? label}
    </button>
  )
}
