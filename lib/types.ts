export type Category =
  | 'Pottery'
  | 'Cooking'
  | 'Dance'
  | 'Climbing'
  | 'Art'
  | 'Outdoors'

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening'

export type Level = 'All levels' | 'Beginner' | 'Some experience'

export interface Session {
  id: string
  date: string // ISO date
  time: string // e.g. "6:30 PM"
  timeOfDay: TimeOfDay
}

export interface ClassListing {
  id: string
  title: string
  provider: string
  category: Category
  subject: string // human label, e.g. "film photography"
  neighborhood: string
  image: string
  pricePerPerson: number
  durationMins: number
  level: Level
  beginnerFriendly: boolean
  blurb: string
  whatYoullDo: string[]
  included: string[]
  requirements: string
  sessions: Session[]
  interestedCount: number
}

export type SocialPace = 'Just the class' | 'Coffee afterward' | 'See how it goes'

export interface ProfilePrompt {
  q: string
  a: string
}

export interface Buddy {
  id: string
  firstName: string
  age: number
  neighborhood: string
  photo: string
  gallery: string[]
  wantsToTryClassId: string
  wantsToTryLabel: string
  availability: string[]
  bio: string
  headlinePrompt: string
  interests: string[]
  sharedInterests: string[]
  reason: string
  socialPace: SocialPace
  intentions: string
  prompts: ProfilePrompt[]
}

export type ProposalStatus = 'proposed' | 'agreed' | 'booking_pending'

export interface SessionProposal {
  id: string
  classId: string
  date: string // ISO
  time: string
  location: string
  pricePerPerson: number
  status: ProposalStatus
  proposedBy: 'me' | 'them'
}

export interface Message {
  id: string
  from: 'me' | 'them'
  kind: 'text' | 'proposal'
  text?: string
  proposal?: SessionProposal
  createdAt: number
}

export interface Conversation {
  buddyId: string
  classId: string
  messages: Message[]
  lastActivity: number
}

export interface UserProfile {
  name: string
  age: number
  neighborhood: string
  photo: string
  hobbies: Category[]
  availability: string[]
  dateRange: string
  budget: number
  travel: string
  buddyAgeRange: [number, number]
  genderPreference: string
  prompts: ProfilePrompt[]
}
