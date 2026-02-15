import { create } from 'zustand'
import { loadTheme, saveTheme, applyTheme, type Theme } from '../services/theme.service'

interface AppState {
    count: number
    theme: Theme
    increment: () => void
    decrement: () => void
    toggleTheme: () => void
}

const initialTheme = loadTheme()
applyTheme(initialTheme)

export const useAppStore = create<AppState>((set) => ({
    count: 0,
    theme: initialTheme,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark'
        saveTheme(newTheme)
        applyTheme(newTheme)
        return { theme: newTheme }
    })
}))
