import { create } from 'zustand'

const loadProgress = () => {
  try {
    const saved = localStorage.getItem('englishHubProgress')
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

const defaultProgress = {
  vocabLearned: 0,
  vocabTotal: 4000,
  grammarCompleted: 0,
  grammarTotal: 16,
  speakingMinutes: 0,
  listeningMinutes: 0,
  readingMinutes: 0,
  streak: 0,
  xp: 0,
  level: 1,
  lastActive: null,
  flashcardDeck: {},
  completedLessons: [],
  achievements: [],
  weeklyGoal: 30, // minutes per day
  dailyMinutes: 0,
}

const useProgressStore = create((set, get) => ({
  ...defaultProgress,
  ...loadProgress(),

  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount
    const newLevel = Math.floor(newXP / 500) + 1
    const updated = { xp: newXP, level: newLevel, lastActive: new Date().toISOString() }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  completeLesson: (lessonId) => set((state) => {
    const completed = [...new Set([...state.completedLessons, lessonId])]
    const updated = { completedLessons: completed, lastActive: new Date().toISOString() }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  learnVocab: (count = 1) => set((state) => {
    const updated = { vocabLearned: state.vocabLearned + count }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  addSpeakingMinutes: (mins) => set((state) => {
    const updated = { speakingMinutes: state.speakingMinutes + mins }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  addListeningMinutes: (mins) => set((state) => {
    const updated = { listeningMinutes: state.listeningMinutes + mins }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  addReadingMinutes: (mins) => set((state) => {
    const updated = { readingMinutes: state.readingMinutes + mins }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  updateStreak: () => set((state) => {
    const today = new Date().toDateString()
    const lastActive = state.lastActive ? new Date(state.lastActive).toDateString() : null
    const yesterday = new Date(Date.now() - 86400000).toDateString()

    let streak = state.streak
    if (lastActive === today) return {}
    if (lastActive === yesterday) streak += 1
    else if (lastActive !== today) streak = 1

    const updated = { streak, lastActive: new Date().toISOString() }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  addFlashcardReview: (wordId, quality) => set((state) => {
    const deck = { ...state.flashcardDeck }
    const card = deck[wordId] || { interval: 0, ease: 2.5, repetitions: 0 }

    // SM-2 spaced repetition algorithm
    if (quality >= 3) {
      card.interval = card.repetitions === 0 ? 1 : card.repetitions === 1 ? 6 : Math.round(card.interval * card.ease)
      card.repetitions += 1
    } else {
      card.repetitions = 0
      card.interval = 1
    }
    card.ease = Math.max(1.3, card.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    card.lastReview = Date.now()
    card.nextReview = Date.now() + card.interval * 86400000
    deck[wordId] = card

    const updated = { flashcardDeck: deck }
    localStorage.setItem('englishHubProgress', JSON.stringify({ ...state, ...updated }))
    return updated
  }),

  getDueCards: () => {
    const state = get()
    const now = Date.now()
    return Object.entries(state.flashcardDeck)
      .filter(([_, card]) => card.nextReview <= now)
      .map(([id, card]) => ({ id, ...card }))
  },

  resetProgress: () => {
    localStorage.removeItem('englishHubProgress')
    set(defaultProgress)
  }
}))

export default useProgressStore
