import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChartCard } from './ChartCard'
import type { Chart } from '../../types'

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
    { label: 'Item 1', value: 50, color: '#ff0000' },
    { label: 'Item 2', value: 30, color: '#00ff00' }
  ],
  thumbnail: 'data:image/png;base64,test-thumbnail',
  createdAt: 1700000000000,
  updatedAt: 1700000000000
}

describe('ChartCard', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the chart card', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByRole('article')).toHaveClass('chart-card')
    })

    it('should display the chart title', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByRole('heading', { name: 'Test Chart' })).toBeInTheDocument()
    })

    it('should display the chart type badge', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByText('bars')).toHaveClass('chart-type-badge')
    })

    it('should display the formatted date', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      // Date should be formatted according to locale
      const dateElement = document.querySelector('.card-date')
      expect(dateElement).toBeInTheDocument()
    })

    it('should render edit button', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    })

    it('should render delete button', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    })
  })

  describe('thumbnail', () => {
    it('should display thumbnail image when available', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      const img = screen.getByRole('img', { name: 'Test Chart' })
      expect(img).toHaveAttribute('src', 'data:image/png;base64,test-thumbnail')
    })

    it('should display fallback when no thumbnail', () => {
      const chartWithoutThumbnail = { ...mockChart, thumbnail: undefined }
      render(
        <ChartCard 
          chart={chartWithoutThumbnail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      const noThumbnail = document.querySelector('.no-thumbnail')
      expect(noThumbnail).toBeInTheDocument()
      expect(noThumbnail?.textContent).toBe('bars')
    })
  })

  describe('interactions', () => {
    it('should call onEdit when edit button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      const editButton = screen.getByRole('button', { name: 'Edit' })
      await user.click(editButton)

      expect(mockOnEdit).toHaveBeenCalledTimes(1)
    })

    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      const deleteButton = screen.getByRole('button', { name: 'Delete' })
      await user.click(deleteButton)

      expect(mockOnDelete).toHaveBeenCalledTimes(1)
    })
  })

  describe('different chart types', () => {
    it('should display circles type badge', () => {
      const circlesChart = { ...mockChart, type: 'circles' as const }
      render(
        <ChartCard 
          chart={circlesChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByText('circles')).toHaveClass('chart-type-badge')
    })

    it('should display donut type badge', () => {
      const donutChart = { ...mockChart, type: 'donut' as const }
      render(
        <ChartCard 
          chart={donutChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByText('donut')).toHaveClass('chart-type-badge')
    })

    it('should display rectangles type badge', () => {
      const rectanglesChart = { ...mockChart, type: 'rectangles' as const }
      render(
        <ChartCard 
          chart={rectanglesChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      expect(screen.getByText('rectangles')).toHaveClass('chart-type-badge')
    })
  })

  describe('accessibility', () => {
    it('should have accessible edit button', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      const editButton = screen.getByRole('button', { name: 'Edit' })
      expect(editButton).toHaveAttribute('title', 'Edit')
    })

    it('should have accessible delete button', () => {
      render(
        <ChartCard 
          chart={mockChart} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      )

      const deleteButton = screen.getByRole('button', { name: 'Delete' })
      expect(deleteButton).toHaveAttribute('title', 'Delete')
    })
  })
})
