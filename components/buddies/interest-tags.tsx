import { cn } from '@/lib/utils'

export function InterestTags({
  interests,
  shared = [],
  className,
}: {
  interests: string[]
  shared?: string[]
  className?: string
}) {
  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {interests.map((interest) => {
        const isShared = shared.includes(interest)
        return (
          <li
            key={interest}
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-medium',
              isShared
                ? 'border-transparent bg-sage/25 text-sage-foreground'
                : 'border-border bg-card text-muted-foreground',
            )}
          >
            {interest}
          </li>
        )
      })}
    </ul>
  )
}
