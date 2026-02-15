import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveChart,
  loadCharts,
  loadChart,
  deleteChart,
  clearGallery,
  getChartCount
} from './gallery.service'
import type { Chart } from '../types/chart.types'

const mockChart: Chart = {
  id: 'chart-1',
  type: 'bars',
  title: 'Test Chart',
  style: {
    font: 'Arial',
    fontSize: '45px',
    backgroundColor: 'transparent'
  },
  valueType: 'value',
  terms: [
    { label: 'A', value: 50, color: '#ff0000' }
  ],
  createdAt: 1000,
  updatedAt: 1000
}

const mockChart2: Chart = {
  ...mockChart,
  id: 'chart-2',
  title: 'Test Chart 2'
}

describe('gallery.service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveChart', () => {
    it('should save a new chart to localStorage', () => {
      saveChart(mockChart)
      const charts = loadCharts()

      expect(charts).toHaveLength(1)
      expect(charts[0]).toEqual(mockChart)
    })

    it('should update an existing chart', () => {
      saveChart(mockChart)
      const updatedChart = { ...mockChart, title: 'Updated Title' }
      saveChart(updatedChart)

      const charts = loadCharts()
      expect(charts).toHaveLength(1)
      expect(charts[0].title).toBe('Updated Title')
    })

    it('should add multiple charts', () => {
      saveChart(mockChart)
      saveChart(mockChart2)

      const charts = loadCharts()
      expect(charts).toHaveLength(2)
    })
  })

  describe('loadCharts', () => {
    it('should return empty array when no charts saved', () => {
      const charts = loadCharts()
      expect(charts).toEqual([])
    })

    it('should return all saved charts', () => {
      saveChart(mockChart)
      saveChart(mockChart2)

      const charts = loadCharts()
      expect(charts).toHaveLength(2)
    })

    it('should return empty array on parse error', () => {
      localStorage.setItem('mister-charts-gallery', 'invalid json')

      const charts = loadCharts()
      expect(charts).toEqual([])
    })
  })

  describe('loadChart', () => {
    it('should return null when chart not found', () => {
      const chart = loadChart('non-existent')
      expect(chart).toBeNull()
    })

    it('should return the chart by id', () => {
      saveChart(mockChart)
      saveChart(mockChart2)

      const chart = loadChart('chart-2')
      expect(chart).toEqual(mockChart2)
    })
  })

  describe('deleteChart', () => {
    it('should remove a chart by id', () => {
      saveChart(mockChart)
      saveChart(mockChart2)

      deleteChart('chart-1')

      const charts = loadCharts()
      expect(charts).toHaveLength(1)
      expect(charts[0].id).toBe('chart-2')
    })

    it('should do nothing if chart does not exist', () => {
      saveChart(mockChart)

      deleteChart('non-existent')

      const charts = loadCharts()
      expect(charts).toHaveLength(1)
    })
  })

  describe('clearGallery', () => {
    it('should remove all charts', () => {
      saveChart(mockChart)
      saveChart(mockChart2)

      clearGallery()

      const charts = loadCharts()
      expect(charts).toEqual([])
    })
  })

  describe('getChartCount', () => {
    it('should return 0 when no charts', () => {
      expect(getChartCount()).toBe(0)
    })

    it('should return correct count', () => {
      saveChart(mockChart)
      saveChart(mockChart2)

      expect(getChartCount()).toBe(2)
    })
  })
})
