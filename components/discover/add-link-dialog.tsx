'use client'

import { useState } from 'react'
import { LinkIcon, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AddLinkDialog() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          setSaved(false)
          setUrl('')
        }
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
        }
      >
        <LinkIcon className="size-4" aria-hidden="true" />
        Have a class in mind? Add a link
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-serif text-xl">Add a class you found</DialogTitle>
        <DialogDescription>
          Paste a class link to preview this feature. Links aren&apos;t saved in the demo.
        </DialogDescription>

        {saved ? (
          <div className="mt-2 rounded-xl border border-sage/50 bg-sage/15 p-4 text-sm text-foreground">
            <p className="flex items-center gap-2 font-medium">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Link preview complete.
            </p>
            <p className="mt-1 text-muted-foreground">
              This demo doesn&apos;t import classes yet. Close this window to browse
              the sample classes.
            </p>
          </div>
        ) : (
          <form
            className="mt-2 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              setSaved(true)
            }}
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="class-link">Class link</Label>
              <Input
                id="class-link"
                type="url"
                inputMode="url"
                placeholder="https://…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="h-10 w-full">
              Add this class
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
