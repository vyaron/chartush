import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createChart,
  getEmptyChart,
  getDefaultStyle,
  addTerm,
  updateTerm,
  removeTerm,
  updateChartType,
  updateChartTitle,
  updateChartStyle,
  calculatePercents
} from './chart.service'
import type { Chart, ChartTerm } from '../types/chart.types'

// Mock the util.service
vi.mock('./util.service', () => ({
  makeId: vi.fn(() => 'test-id-123'),
  getUniqueColors: vi.fn((count: number) => 
    ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'].slice(0, count)
  )
}))

describe('chart.service', () => {
  const mockChart: Chart = {
    id: 'test-id',
    type: 'bars',
    title: 'Test Chart',
    style: {
      font: 'Arial',
      fontSize: '45px',
      backgroundColor: 'transparent'
    },
    valueType: 'value',
    terms: [
      { label: 'A', value: 50, color: '#ff0000' },
      { label: 'B', value: 30, color: '#00ff00' }
    ],
    createdAt: 1000,
    updatedAt: 1000
  }

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1))
  })

  describe('createChart', () => {
    it('should create a chart with id and timestamps', () => {
      const chartData = {
        type: 'bars' as const,
        title: 'New Chart',
        style: getDefaultStyle(),
        valueType: 'value' as const,
        terms: []
      }

      const chart = createChart(chartData)

      expect(chart.id).toBe('test-id-123')
      expect(chart.title).toBe('New Chart')
      expect(chart.createdAt).toBe(Date.now())
      expect(chart.updatedAt).toBe(Date.now())
    })
  })

  describe('getEmptyChart', () => {
    it('should return a chart with default values', () => {
      const chart = getEmptyChart()

      expect(chart.type).toBe('bars')
      expect(chart.title).toBe('My Chart')
      expect(chart.terms).toHaveLength(3)
      expect(chart.valueType).toBe('value')
    })

    it('should have terms with unique colors', () => {
      const chart = getEmptyChart()
      const colors = chart.terms.map(t => t.color)
      const uniqueColors = new Set(colors)
      expect(uniqueColors.size).toBe(colors.length)
    })
  })

  describe('getDefaultStyle', () => {
    it('should return default style object', () => {
      const style = getDefaultStyle()

      expect(style.font).toBe('Arial')
      expect(style.fontSize).toBe('45px')
      expect(style.backgroundColor).toBe('transparent')
    })
  })

  describe('addTerm', () => {
    it('should add a new term to the chart', () => {
      const newTerm: ChartTerm = { label: 'C', value: 20, color: '#0000ff' }
      const updated = addTerm(mockChart, newTerm)

      expect(updated.terms).toHaveLength(3)
      expect(updated.terms[2]).toEqual(newTerm)
    })

    it('should update the updatedAt timestamp', () => {
      const newTerm: ChartTerm = { label: 'C', value: 20, color: '#0000ff' }
      const updated = addTerm(mockChart, newTerm)

      expect(updated.updatedAt).toBe(Date.now())
    })

    it('should not mutate the original chart', () => {
      const newTerm: ChartTerm = { label: 'C', value: 20, color: '#0000ff' }
      addTerm(mockChart, newTerm)

      expect(mockChart.terms).toHaveLength(2)
    })
  })

  describe('updateTerm', () => {
    it('should update a term at the given index', () => {
      const updated = updateTerm(mockChart, 0, { value: 100 })

      expect(updated.terms[0].value).toBe(100)
      expect(updated.terms[0].label).toBe('A')
    })

    it('should update the updatedAt timestamp', () => {
      const updated = updateTerm(mockChart, 0, { label: 'Updated' })

      expect(updated.updatedAt).toBe(Date.now())
    })

    it('should not mutate the original chart', () => {
      updateTerm(mockChart, 0, { value: 100 })

      expect(mockChart.terms[0].value).toBe(50)
    })
  })

  describe('removeTerm', () => {
    it('should remove a term at the given index', () => {
      const updated = removeTerm(mockChart, 0)

      expect(updated.terms).toHaveLength(1)
      expect(updated.terms[0].label).toBe('B')
    })

    it('should update the updatedAt timestamp', () => {
      const updated = removeTerm(mockChart, 0)

      expect(updated.updatedAt).toBe(Date.now())
    })

    it('should not mutate the original chart', () => {
      removeTerm(mockChart, 0)

      expect(mockChart.terms).toHaveLength(2)
    })
  })

  describe('updateChartType', () => {
    it('should update the chart type', () => {
      const updated = updateChartType(mockChart, 'donut')

      expect(updated.type).toBe('donut')
    })

    it('should update the updatedAt timestamp', () => {
      const updated = updateChartType(mockChart, 'circles')

      expect(updated.updatedAt).toBe(Date.now())
    })
  })

  describe('updateChartTitle', () => {
    it('should update the chart title', () => {
      const updated = updateChartTitle(mockChart, 'New Title')

      expect(updated.title).toBe('New Title')
    })

    it('should update the updatedAt timestamp', () => {
      const updated = updateChartTitle(mockChart, 'New Title')

      expect(updated.updatedAt).toBe(Date.now())
    })
  })

  describe('updateChartStyle', () => {
    it('should update partial style properties', () => {
      const updated = updateChartStyle(mockChart, { fontSize: '24px' })

      expect(updated.style.fontSize).toBe('24px')
      expect(updated.style.font).toBe('Arial')
    })

    it('should update the updatedAt timestamp', () => {
      const updated = updateChartStyle(mockChart, { font: 'Georgia' })

      expect(updated.updatedAt).toBe(Date.now())
    })
  })

  describe('calculatePercents', () => {
    it('should calculate percentages for terms', () => {
      const terms: ChartTerm[] = [
        { label: 'A', value: 50, color: '#ff0000' },
        { label: 'B', value: 25, color: '#00ff00' },
        { label: 'C', value: 25, color: '#0000ff' }
      ]

      const percents = calculatePercents(terms)

      expect(percents).toEqual([50, 25, 25])
    })

    it('should handle empty terms array', () => {
      const percents = calculatePercents([])

      expect(percents).toEqual([])
    })

    it('should handle all zero values', () => {
      const terms: ChartTerm[] = [
        { label: 'A', value: 0, color: '#ff0000' },
        { label: 'B', value: 0, color: '#00ff00' }
      ]

      const percents = calculatePercents(terms)

      expect(percents).toEqual([0, 0])
    })

    it('should round to nearest integer', () => {
      const terms: ChartTerm[] = [
        { label: 'A', value: 1, color: '#ff0000' },
        { label: 'B', value: 2, color: '#00ff00' }
      ]

      const percents = calculatePercents(terms)

      expect(percents).toEqual([33, 67])
    })
  })
})
