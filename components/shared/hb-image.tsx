'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HbImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export function HbImage({
  src,
  alt,
  className,
  imgClassName,
  priority,
  fill,
  sizes,
}: HbImageProps) {
  const [errored, setErrored] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-muted', fill && 'absolute inset-0 h-full w-full', className)}>
      {errored ? (
        <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
          <ImageOff className="size-6" aria-hidden="true" />
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src || '/placeholder.svg'}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setErrored(true)}
          className={cn(
            'h-full w-full object-cover transition-transform duration-500',
            imgClassName,
          )}
        />
      )}
    </div>
  )
}
