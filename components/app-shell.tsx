'use client'

import { useState } from 'react'
import { useDemo } from '@/lib/store'
import { useNav } from '@/lib/navigation'
import { MatchContext } from '@/lib/match-context'
import { TopNav } from '@/components/nav/top-nav'
import { BottomNav } from '@/components/nav/bottom-nav'
import { DemoRibbon } from '@/components/shared/demo-ribbon'
import { Wordmark } from '@/components/shared/wordmark'
import { MatchDialog } from '@/components/match/match-dialog'
import { DiscoverView } from '@/components/discover/discover-view'
import { ClassDetailsView } from '@/components/class/class-details-view'
import { BuddiesView } from '@/components/buddies/buddies-view'
import { MessagesView } from '@/components/messages/messages-view'
import { PlansView } from '@/components/plans/plans-view'
import { ProfileView } from '@/components/profile/profile-view'
import { OnboardingView } from '@/components/onboarding/onboarding-view'

function LoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="animate-pulse">
        <Wordmark className="text-2xl" />
      </div>
    </div>
  )
}

export function AppShell() {
  const { hydrated } = useDemo()
  const nav = useNav()
  const [matchBuddyId, setMatchBuddyId] = useState<string | null>(null)

  if (!hydrated) return <LoadingScreen />

  if (nav.view === 'onboarding') {
    return <OnboardingView />
  }

  function renderView() {
    switch (nav.view) {
      case 'discover':
        return <DiscoverView />
      case 'class':
        return <ClassDetailsView classId={nav.classId} />
      case 'buddies':
        return (
          <BuddiesView contextClassId={nav.contextClassId} buddyId={nav.buddyId} />
        )
      case 'messages':
        return <MessagesView conversationId={nav.conversationId} />
      case 'plans':
        return <PlansView />
      case 'profile':
        return <ProfileView />
      default:
        return <DiscoverView />
    }
  }

  return (
    <MatchContext.Provider value={{ triggerMatch: setMatchBuddyId }}>
      <div className="flex min-h-dvh flex-col bg-background">
        <DemoRibbon />
        <TopNav />
        <main className="flex-1 pb-24 md:pb-0">{renderView()}</main>
        <BottomNav />
      </div>
      <MatchDialog buddyId={matchBuddyId} onClose={() => setMatchBuddyId(null)} />
    </MatchContext.Provider>
  )
}
