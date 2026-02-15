import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loadTheme, saveTheme, applyTheme, type Theme } from './theme.service'

describe('theme.service', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  describe('loadTheme', () => {
    it('should return stored theme when valid', () => {
      localStorage.setItem('theme', 'light')
      expect(loadTheme()).toBe('light')
    })

    it('should return dark when stored', () => {
      localStorage.setItem('theme', 'dark')
      expect(loadTheme()).toBe('dark')
    })

    it('should check system preference when no stored theme', () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: true })
      vi.stubGlobal('matchMedia', matchMediaMock)

      const theme = loadTheme()

      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: light)')
      expect(theme).toBe('light')

      vi.unstubAllGlobals()
    })

    it('should return dark as default when system prefers dark', () => {
      const matchMediaMock = vi.fn().mockReturnValue({ matches: false })
      vi.stubGlobal('matchMedia', matchMediaMock)

      const theme = loadTheme()
      expect(theme).toBe('dark')

      vi.unstubAllGlobals()
    })

    it('should ignore invalid stored values', () => {
      localStorage.setItem('theme', 'invalid')
      const matchMediaMock = vi.fn().mockReturnValue({ matches: false })
      vi.stubGlobal('matchMedia', matchMediaMock)

      const theme = loadTheme()
      expect(theme).toBe('dark')

      vi.unstubAllGlobals()
    })
  })

  describe('saveTheme', () => {
    it('should save light theme to localStorage', () => {
      saveTheme('light')
      expect(localStorage.getItem('theme')).toBe('light')
    })

    it('should save dark theme to localStorage', () => {
      saveTheme('dark')
      expect(localStorage.getItem('theme')).toBe('dark')
    })
  })

  describe('applyTheme', () => {
    it('should set data-theme attribute to light', () => {
      applyTheme('light')
      expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    })

    it('should set data-theme attribute to dark', () => {
      applyTheme('dark')
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    })
  })
})
