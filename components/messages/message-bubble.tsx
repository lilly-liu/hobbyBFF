'use client'

import type { Message } from '@/lib/types'
import { cn } from '@/lib/utils'

export function MessageBubble({ message }: { message: Message }) {
  const mine = message.from === 'me'
  return (
    <div className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed text-pretty',
          mine
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md bg-muted text-foreground',
        )}
      >
        {message.text}
      </div>
    </div>
  )
}
