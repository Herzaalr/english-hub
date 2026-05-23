import { create } from 'zustand'

const useSettingsStore = create((set) => ({
  apiKey: localStorage.getItem('ehub_apiKey') || '',
  apiProvider: localStorage.getItem('ehub_apiProvider') || 'openai',
  apiModel: localStorage.getItem('ehub_apiModel') || 'gpt-4o-mini',
  setApiKey: (key) => {
    localStorage.setItem('ehub_apiKey', key)
    set({ apiKey: key })
  },
  setApiProvider: (p) => {
    localStorage.setItem('ehub_apiProvider', p)
    set({ apiProvider: p })
  },
  setApiModel: (m) => {
    localStorage.setItem('ehub_apiModel', m)
    set({ apiModel: m })
  },
}))

export default useSettingsStore
