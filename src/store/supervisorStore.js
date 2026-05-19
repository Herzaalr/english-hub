import { create } from 'zustand'

const defaultTasks = [
  { id: 1, text: "Review all Simple Tenses (Simple Present, Past, Future)", priority: "high", done: false, dueDate: "2026-05-26" },
  { id: 2, text: "Learn 50 new vocabulary words from Academic Word List", priority: "high", done: false, dueDate: "2026-05-23" },
  { id: 3, text: "Practice pronunciation: /θ/ and /ð/ sounds (think, this)", priority: "medium", done: false, dueDate: "2026-05-25" },
  { id: 4, text: "Complete listening exercise: TED Talk #3", priority: "medium", done: false, dueDate: "2026-05-24" },
  { id: 5, text: "Read and summarize 1 news article", priority: "low", done: false, dueDate: "2026-05-27" },
]

const useSupervisorStore = create((set, get) => ({
  tasks: JSON.parse(localStorage.getItem('supervisorTasks') || 'null') || defaultTasks,

  toggleTask: (id) => set((state) => {
    const tasks = state.tasks.map(t => t.id === id ? { ...t, done: !t.done } : t)
    localStorage.setItem('supervisorTasks', JSON.stringify(tasks))
    return { tasks }
  }),

  addTask: (text, priority = 'medium') => set((state) => {
    const tasks = [...state.tasks, { id: Date.now(), text, priority, done: false, dueDate: null }]
    localStorage.setItem('supervisorTasks', JSON.stringify(tasks))
    return { tasks }
  }),

  removeTask: (id) => set((state) => {
    const tasks = state.tasks.filter(t => t.id !== id)
    localStorage.setItem('supervisorTasks', JSON.stringify(tasks))
    return { tasks }
  }),

  getPendingTasks: () => get().tasks.filter(t => !t.done),
  getHighPriority: () => get().tasks.filter(t => !t.done && t.priority === 'high'),
}))

export default useSupervisorStore
