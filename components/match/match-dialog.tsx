'use client'

import { MapPin, Heart } from 'lucide-react'
import { getBuddy, getClass, useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HbImage } from '@/components/shared/hb-image'

interface MatchDialogProps {
  buddyId: string | null
  onClose: () => void
}

export function MatchDialog({ buddyId, onClose }: MatchDialogProps) {
  const { profile } = useDemo()
  const nav = useNav()
  const buddy = buddyId ? getBuddy(buddyId) : undefined
  const listing = buddy ? getClass(buddy.wantsToTryClassId) : undefined

  return (
    <Dialog open={!!buddy} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden p-0 sm:max-w-md"
      >
        {buddy && listing && (
          <div className="flex flex-col">
            <div className="relative bg-primary px-6 pt-7 pb-16 text-center text-primary-foreground">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">
                It&apos;s mutual
              </p>
              <DialogTitle className="mt-2 font-serif text-2xl leading-tight font-semibold text-balance text-primary-foreground">
                You both want to give {listing.subject} a go.
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-primary-foreground/85">
                Only mutual matches can message. Say hello and start a plan.
              </DialogDescription>
            </div>

            <div className="-mt-12 flex items-end justify-center gap-3 px-6">
              <div className="size-24 overflow-hidden rounded-2xl border-4 border-popover shadow-sm">
                <HbImage src={profile.photo} alt="You" className="h-full w-full" />
              </div>
              <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-popover text-primary shadow-sm">
                <Heart className="size-4 fill-primary" aria-hidden="true" />
              </div>
              <div className="size-24 overflow-hidden rounded-2xl border-4 border-popover shadow-sm">
                <HbImage
                  src={buddy.photo}
                  alt={buddy.firstName}
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="px-6 pt-4 pb-6">
              <div className="rounded-xl border border-border bg-muted/50 p-3">
                <p className="font-serif text-sm font-semibold">{listing.title}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" aria-hidden="true" />
                  {listing.neighborhood} · with {buddy.firstName}, {buddy.age}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  size="lg"
                  className="h-11 w-full text-sm"
                  onClick={() => {
                    onClose()
                    nav.navigate({
                      view: 'messages',
                      buddyId: buddy.id,
                      conversationId: buddy.id,
                    })
                  }}
                >
                  Say hello
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-11 w-full text-sm"
                  onClick={onClose}
                >
                  Keep exploring
                </Button>
              </div>

              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Demo match. {buddy.firstName} isn&apos;t a real
                person.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
