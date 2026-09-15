import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-serif text-xl font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      hobby<span className="text-primary">BFF</span>
    </span>
  )
}
