'use client'

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'
import {
  BUDDIES,
  CLASSES,
  DEFAULT_PROFILE,
  DEMO_MATCH_BUDDY_ID,
  seedConversations,
} from './mock-data'
import type {
  Conversation,
  Message,
  ProposalStatus,
  SessionProposal,
  UserProfile,
} from './types'

const STORAGE_KEY = 'hobbybff:v2'

interface State {
  hydrated: boolean
  location: string
  onboardingComplete: boolean
  profile: UserProfile
  savedClassIds: string[]
  passedBuddyIds: string[]
  likedBuddyIds: string[]
  matchedBuddyIds: string[]
  conversations: Record<string, Conversation>
  lastPassedBuddyId: string | null
}

function initialState(): State {
  return {
    hydrated: false,
    location: 'Boston, MA',
    onboardingComplete: false,
    profile: DEFAULT_PROFILE,
    savedClassIds: ['botanical-watercolor'],
    passedBuddyIds: [],
    likedBuddyIds: ['jordan'],
    matchedBuddyIds: ['jordan'],
    conversations: seedConversations(),
    lastPassedBuddyId: null,
  }
}

function greetingFor(buddyId: string): Conversation | null {
  const buddy = BUDDIES.find((b) => b.id === buddyId)
  if (!buddy) return null
  return {
    buddyId,
    classId: buddy.wantsToTryClassId,
    lastActivity: Date.now(),
    messages: [
      {
        id: `${buddyId}-hello`,
        from: 'them',
        kind: 'text',
        text: `Hi! Have you tried ${buddy.wantsToTryLabel.toLowerCase()} before? When are you free to go?`,
        createdAt: Date.now(),
      },
    ],
  }
}

type Action =
  | { type: 'HYDRATE'; payload: Partial<State> }
  | { type: 'SET_LOCATION'; location: string }
  | { type: 'COMPLETE_ONBOARDING'; profile: UserProfile }
  | { type: 'UPDATE_PROFILE'; profile: Partial<UserProfile> }
  | { type: 'TOGGLE_SAVE'; classId: string }
  | { type: 'PASS_BUDDY'; buddyId: string }
  | { type: 'UNDO_PASS' }
  | { type: 'LIKE_BUDDY'; buddyId: string }
  | { type: 'SEND_MESSAGE'; buddyId: string; message: Message }
  | { type: 'PROPOSE_SESSION'; buddyId: string; proposal: SessionProposal }
  | {
      type: 'UPDATE_PROPOSAL'
      buddyId: string
      proposalId: string
      status: ProposalStatus
    }
  | { type: 'RESET_DEMO' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, hydrated: true }
    case 'SET_LOCATION':
      return { ...state, location: action.location }
    case 'COMPLETE_ONBOARDING':
      return { ...state, profile: action.profile, onboardingComplete: true }
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: { ...state.profile, ...action.profile },
        onboardingComplete: true,
      }
    case 'TOGGLE_SAVE': {
      const saved = state.savedClassIds.includes(action.classId)
      return {
        ...state,
        savedClassIds: saved
          ? state.savedClassIds.filter((id) => id !== action.classId)
          : [...state.savedClassIds, action.classId],
      }
    }
    case 'PASS_BUDDY':
      if (state.passedBuddyIds.includes(action.buddyId)) return state
      return {
        ...state,
        passedBuddyIds: [...state.passedBuddyIds, action.buddyId],
        likedBuddyIds: state.likedBuddyIds.filter((id) => id !== action.buddyId),
        lastPassedBuddyId: action.buddyId,
      }
    case 'UNDO_PASS':
      if (!state.lastPassedBuddyId) return state
      return {
        ...state,
        passedBuddyIds: state.passedBuddyIds.filter(
          (id) => id !== state.lastPassedBuddyId,
        ),
        lastPassedBuddyId: null,
      }
    case 'LIKE_BUDDY': {
      const liked = state.likedBuddyIds.includes(action.buddyId)
        ? state.likedBuddyIds
        : [...state.likedBuddyIds, action.buddyId]
      const passed = state.passedBuddyIds.filter((id) => id !== action.buddyId)
      // The designated demo profile mutually matches back.
      const isDemoMatch = action.buddyId === DEMO_MATCH_BUDDY_ID
      if (isDemoMatch && !state.matchedBuddyIds.includes(action.buddyId)) {
        const convo = greetingFor(action.buddyId)
        return {
          ...state,
          likedBuddyIds: liked,
          passedBuddyIds: passed,
          matchedBuddyIds: [...state.matchedBuddyIds, action.buddyId],
          conversations: convo
            ? { ...state.conversations, [action.buddyId]: convo }
            : state.conversations,
        }
      }
      return { ...state, likedBuddyIds: liked, passedBuddyIds: passed }
    }
    case 'SEND_MESSAGE': {
      const convo = state.conversations[action.buddyId]
      if (!convo) return state
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.buddyId]: {
            ...convo,
            messages: [...convo.messages, action.message],
            lastActivity: action.message.createdAt,
          },
        },
      }
    }
    case 'PROPOSE_SESSION': {
      const convo = state.conversations[action.buddyId]
      if (!convo) return state
      const message: Message = {
        id: action.proposal.id,
        from: action.proposal.proposedBy,
        kind: 'proposal',
        proposal: action.proposal,
        createdAt: Date.now(),
      }
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.buddyId]: {
            ...convo,
            messages: [...convo.messages, message],
            lastActivity: message.createdAt,
          },
        },
      }
    }
    case 'UPDATE_PROPOSAL': {
      const convo = state.conversations[action.buddyId]
      if (!convo) return state
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.buddyId]: {
            ...convo,
            messages: convo.messages.map((m) =>
              m.kind === 'proposal' && m.proposal?.id === action.proposalId
                ? { ...m, proposal: { ...m.proposal, status: action.status } }
                : m,
            ),
            lastActivity: Date.now(),
          },
        },
      }
    }
    case 'RESET_DEMO':
      return { ...initialState(), hydrated: true }
    default:
      return state
  }
}

interface StoreContextValue extends State {
  setLocation: (location: string) => void
  completeOnboarding: (profile: UserProfile) => void
  updateProfile: (profile: Partial<UserProfile>) => void
  toggleSave: (classId: string) => void
  isSaved: (classId: string) => boolean
  passBuddy: (buddyId: string) => void
  undoPass: () => void
  likeBuddy: (buddyId: string) => boolean // returns true if this created a mutual match
  sendMessage: (buddyId: string, text: string) => void
  sendBuddyMessage: (buddyId: string, text: string) => void
  proposeSession: (buddyId: string, proposal: SessionProposal) => void
  updateProposal: (
    buddyId: string,
    proposalId: string,
    status: ProposalStatus,
  ) => void
  resetDemo: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>
        dispatch({ type: 'HYDRATE', payload: parsed })
      } else {
        dispatch({ type: 'HYDRATE', payload: {} })
      }
    } catch {
      dispatch({ type: 'HYDRATE', payload: {} })
    }
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    const { hydrated, ...persist } = state
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
    } catch {
      // ignore write failures (private mode, quota)
    }
  }, [state])

  const value: StoreContextValue = {
    ...state,
    setLocation: (location) => dispatch({ type: 'SET_LOCATION', location }),
    completeOnboarding: (profile) =>
      dispatch({ type: 'COMPLETE_ONBOARDING', profile }),
    updateProfile: (profile) => dispatch({ type: 'UPDATE_PROFILE', profile }),
    toggleSave: (classId) => dispatch({ type: 'TOGGLE_SAVE', classId }),
    isSaved: (classId) => state.savedClassIds.includes(classId),
    passBuddy: (buddyId) => dispatch({ type: 'PASS_BUDDY', buddyId }),
    undoPass: () => dispatch({ type: 'UNDO_PASS' }),
    likeBuddy: (buddyId) => {
      const willMatch =
        buddyId === DEMO_MATCH_BUDDY_ID &&
        !state.matchedBuddyIds.includes(buddyId)
      dispatch({ type: 'LIKE_BUDDY', buddyId })
      return willMatch
    },
    sendMessage: (buddyId, text) =>
      dispatch({
        type: 'SEND_MESSAGE',
        buddyId,
        message: {
          id: `${buddyId}-${Date.now()}`,
          from: 'me',
          kind: 'text',
          text,
          createdAt: Date.now(),
        },
      }),
    sendBuddyMessage: (buddyId, text) =>
      dispatch({
        type: 'SEND_MESSAGE',
        buddyId,
        message: {
          id: `${buddyId}-them-${Date.now()}`,
          from: 'them',
          kind: 'text',
          text,
          createdAt: Date.now(),
        },
      }),
    proposeSession: (buddyId, proposal) =>
      dispatch({ type: 'PROPOSE_SESSION', buddyId, proposal }),
    updateProposal: (buddyId, proposalId, status) =>
      dispatch({ type: 'UPDATE_PROPOSAL', buddyId, proposalId, status }),
    resetDemo: () => {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      dispatch({ type: 'RESET_DEMO' })
    },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useDemo(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}

export function getClass(id: string) {
  return CLASSES.find((c) => c.id === id)
}

export function getBuddy(id: string) {
  return BUDDIES.find((b) => b.id === id)
}
