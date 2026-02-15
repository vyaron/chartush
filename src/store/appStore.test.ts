import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAppStore } from './appStore'

// Mock the theme service
vi.mock('../services/theme.service', () => ({
  loadTheme: vi.fn(() => 'dark'),
  saveTheme: vi.fn(),
  applyTheme: vi.fn()
}))

import { saveTheme, applyTheme } from '../services/theme.service'

describe('appStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the store to initial state
    useAppStore.setState({ count: 0, theme: 'dark' })
  })

  describe('initial state', () => {
    it('should have count of 0', () => {
      expect(useAppStore.getState().count).toBe(0)
    })

    it('should have theme from loadTheme', () => {
      expect(useAppStore.getState().theme).toBe('dark')
    })
  })

  describe('increment', () => {
    it('should increment count by 1', () => {
      useAppStore.getState().increment()

      expect(useAppStore.getState().count).toBe(1)
    })

    it('should increment multiple times', () => {
      useAppStore.getState().increment()
      useAppStore.getState().increment()
      useAppStore.getState().increment()

      expect(useAppStore.getState().count).toBe(3)
    })
  })

  describe('decrement', () => {
    it('should decrement count by 1', () => {
      useAppStore.setState({ count: 5 })

      useAppStore.getState().decrement()

      expect(useAppStore.getState().count).toBe(4)
    })

    it('should allow negative values', () => {
      useAppStore.getState().decrement()

      expect(useAppStore.getState().count).toBe(-1)
    })
  })

  describe('toggleTheme', () => {
    it('should toggle from dark to light', () => {
      useAppStore.setState({ theme: 'dark' })

      useAppStore.getState().toggleTheme()

      expect(useAppStore.getState().theme).toBe('light')
    })

    it('should toggle from light to dark', () => {
      useAppStore.setState({ theme: 'light' })

      useAppStore.getState().toggleTheme()

      expect(useAppStore.getState().theme).toBe('dark')
    })

    it('should save theme to storage', () => {
      useAppStore.setState({ theme: 'dark' })

      useAppStore.getState().toggleTheme()

      expect(saveTheme).toHaveBeenCalledWith('light')
    })

    it('should apply theme to DOM', () => {
      useAppStore.setState({ theme: 'dark' })

      useAppStore.getState().toggleTheme()

      expect(applyTheme).toHaveBeenCalledWith('light')
    })
  })
})
