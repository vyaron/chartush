import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useChartStore } from './chartStore'
import type { Chart } from '../types'

// Mock dependencies
vi.mock('../services/gallery.service', () => ({
  saveChart: vi.fn(),
  loadChart: vi.fn()
}))

vi.mock('../services/util.service', () => ({
  getUniqueColors: vi.fn((count: number) => 
    ['#ff0000', '#00ff00', '#0000ff'].slice(0, count)
  ),
  makeId: vi.fn(() => 'test-id')
}))

import { saveChart, loadChart } from '../services/gallery.service'

describe('chartStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
    useChartStore.getState().resetChart()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have a default chart', () => {
      const { chart } = useChartStore.getState()

      expect(chart.title).toBe('My Chart')
      expect(chart.type).toBe('bars')
      expect(chart.terms).toHaveLength(3)
    })
  })

  describe('setChart', () => {
    it('should replace the entire chart', () => {
      const newChart: Chart = {
        id: 'new-id',
        type: 'donut',
        title: 'New Chart',
        style: { font: 'Georgia', fontSize: '20px', backgroundColor: '#fff' },
        valueType: 'percent',
        terms: [],
        createdAt: 1000,
        updatedAt: 1000
      }

      useChartStore.getState().setChart(newChart)

      expect(useChartStore.getState().chart).toEqual(newChart)
    })
  })

  describe('updateTitle', () => {
    it('should update the chart title', () => {
      useChartStore.getState().updateTitle('Updated Title')

      expect(useChartStore.getState().chart.title).toBe('Updated Title')
    })

    it('should update updatedAt timestamp', () => {
      const before = useChartStore.getState().chart.updatedAt
      vi.advanceTimersByTime(1000)
      
      useChartStore.getState().updateTitle('New Title')

      expect(useChartStore.getState().chart.updatedAt).toBeGreaterThan(before)
    })
  })

  describe('updateType', () => {
    it('should update the chart type', () => {
      useChartStore.getState().updateType('circles')

      expect(useChartStore.getState().chart.type).toBe('circles')
    })
  })

  describe('updateValueType', () => {
    it('should update the value type', () => {
      useChartStore.getState().updateValueType('percent')

      expect(useChartStore.getState().chart.valueType).toBe('percent')
    })
  })

  describe('addTerm', () => {
    it('should add a new term', () => {
      const initialLength = useChartStore.getState().chart.terms.length

      useChartStore.getState().addTerm()

      expect(useChartStore.getState().chart.terms).toHaveLength(initialLength + 1)
    })

    it('should create term with incremented label', () => {
      useChartStore.getState().addTerm()

      const terms = useChartStore.getState().chart.terms
      expect(terms[terms.length - 1].label).toBe('Item 4')
    })
  })

  describe('updateTerm', () => {
    it('should update a term at given index', () => {
      useChartStore.getState().updateTerm(0, { value: 100, label: 'Updated' })

      const term = useChartStore.getState().chart.terms[0]
      expect(term.value).toBe(100)
      expect(term.label).toBe('Updated')
    })
  })

  describe('removeTerm', () => {
    it('should remove a term at given index', () => {
      const firstTermLabel = useChartStore.getState().chart.terms[0].label

      useChartStore.getState().removeTerm(0)

      const terms = useChartStore.getState().chart.terms
      expect(terms[0].label).not.toBe(firstTermLabel)
    })
  })

  describe('updateStyle', () => {
    it('should update partial style', () => {
      useChartStore.getState().updateStyle({ font: 'Georgia' })

      const style = useChartStore.getState().chart.style
      expect(style.font).toBe('Georgia')
      expect(style.fontSize).toBe('45px')
    })
  })

  describe('updateThumbnail', () => {
    it('should update thumbnail', () => {
      useChartStore.getState().updateThumbnail('data:image/png;base64,abc')

      expect(useChartStore.getState().chart.thumbnail).toBe('data:image/png;base64,abc')
    })
  })

  describe('saveToGallery', () => {
    it('should call saveChart with current chart', () => {
      useChartStore.getState().saveToGallery()

      expect(saveChart).toHaveBeenCalledWith(useChartStore.getState().chart)
    })
  })

  describe('loadFromGallery', () => {
    it('should return true and set chart when found', () => {
      const mockChart: Chart = {
        id: 'loaded-id',
        type: 'donut',
        title: 'Loaded Chart',
        style: { font: 'Arial', fontSize: '45px', backgroundColor: 'transparent' },
        valueType: 'value',
        terms: [],
        createdAt: 1000,
        updatedAt: 1000
      }
      vi.mocked(loadChart).mockReturnValue(mockChart)

      const result = useChartStore.getState().loadFromGallery('loaded-id')

      expect(result).toBe(true)
      expect(useChartStore.getState().chart).toEqual(mockChart)
    })

    it('should return false when chart not found', () => {
      vi.mocked(loadChart).mockReturnValue(null)

      const result = useChartStore.getState().loadFromGallery('non-existent')

      expect(result).toBe(false)
    })
  })

  describe('resetChart', () => {
    it('should reset to a new empty chart', () => {
      useChartStore.getState().updateTitle('Modified Title')
      
      useChartStore.getState().resetChart()

      expect(useChartStore.getState().chart.title).toBe('My Chart')
    })
  })
})
