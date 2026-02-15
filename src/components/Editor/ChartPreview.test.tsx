import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChartPreview } from './ChartPreview'
import { useChartStore } from '../../store/chartStore'
import type { Chart } from '../../types'

// Mock the chart store
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
  createdAt: 1000,
  updatedAt: 1000
}

const mockUpdateThumbnail = vi.fn()

vi.mock('../../store/chartStore', () => ({
  useChartStore: vi.fn()
}))

// Mock chart drawing functions
vi.mock('../Charts/BarsChart', () => ({
  drawBarsChart: vi.fn()
}))

vi.mock('../Charts/CirclesChart', () => ({
  drawCirclesChart: vi.fn()
}))

vi.mock('../Charts/RectanglesChart', () => ({
  drawRectanglesChart: vi.fn()
}))

vi.mock('../Charts/DonutChart', () => ({
  drawDonutChart: vi.fn()
}))

// Mock animation service
const mockAnimationController = {
  play: vi.fn(),
  stop: vi.fn()
}

vi.mock('../../services/animation.service', () => ({
  createAnimationController: vi.fn(() => mockAnimationController),
  exportToGif: vi.fn().mockResolvedValue(new Blob()),
  downloadBlob: vi.fn()
}))

// Mock canvas context
const mockContext = {
  fillStyle: '',
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn()
}

// Mock HTMLCanvasElement.getContext
// eslint-disable-next-line @typescript-eslint/no-explicit-any
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext) as any
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,test')

describe('ChartPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useChartStore).mockImplementation((selector) => {
      const state = {
        chart: mockChart,
        updateThumbnail: mockUpdateThumbnail
      }
      return selector(state as unknown as ReturnType<typeof useChartStore.getState>)
    })
  })

  describe('rendering', () => {
    it('should render the chart preview container', () => {
      render(<ChartPreview />)

      expect(document.querySelector('.chart-preview')).toBeInTheDocument()
    })

    it('should render the chart title', () => {
      render(<ChartPreview />)

      expect(screen.getByRole('heading', { name: 'Test Chart' })).toBeInTheDocument()
    })

    it('should render a canvas element', () => {
      render(<ChartPreview />)

      const canvas = document.querySelector('canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas).toHaveAttribute('width', '600')
      expect(canvas).toHaveAttribute('height', '400')
    })

    it('should render play animation button', () => {
      render(<ChartPreview />)

      expect(screen.getByRole('button', { name: '▶ Play Animation' })).toBeInTheDocument()
    })

    it('should render download GIF button', () => {
      render(<ChartPreview />)

      expect(screen.getByRole('button', { name: '⬇ Download GIF' })).toBeInTheDocument()
    })
  })

  describe('chart initialization', () => {
    it('should get canvas context on mount', () => {
      render(<ChartPreview />)

      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d')
    })

    it('should update thumbnail after drawing', async () => {
      render(<ChartPreview />)

      await waitFor(() => {
        expect(mockUpdateThumbnail).toHaveBeenCalledWith('data:image/png;base64,test')
      })
    })
  })

  describe('animation controls', () => {
    it('should toggle play button text when clicked', async () => {
      const user = userEvent.setup()
      render(<ChartPreview />)

      const playButton = screen.getByRole('button', { name: '▶ Play Animation' })
      await user.click(playButton)

      expect(screen.getByRole('button', { name: '⏹ Stop' })).toBeInTheDocument()
    })

    it('should call animation controller play on click', async () => {
      const user = userEvent.setup()
      render(<ChartPreview />)

      const playButton = screen.getByRole('button', { name: '▶ Play Animation' })
      await user.click(playButton)

      expect(mockAnimationController.play).toHaveBeenCalled()
    })

    it('should call animation controller stop when stopping', async () => {
      const user = userEvent.setup()
      render(<ChartPreview />)

      // Start animation
      const playButton = screen.getByRole('button', { name: '▶ Play Animation' })
      await user.click(playButton)

      // Stop animation
      const stopButton = screen.getByRole('button', { name: '⏹ Stop' })
      await user.click(stopButton)

      expect(mockAnimationController.stop).toHaveBeenCalled()
    })
  })

  describe('GIF export', () => {
    it('should disable play button while exporting', async () => {
      const { exportToGif } = await import('../../services/animation.service')
      vi.mocked(exportToGif).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(new Blob()), 100))
      )

      const user = userEvent.setup()
      render(<ChartPreview />)

      const downloadButton = screen.getByRole('button', { name: '⬇ Download GIF' })
      await user.click(downloadButton)

      const playButton = screen.getByText('▶ Play Animation').closest('button')
      expect(playButton).toBeDisabled()
    })

    it('should disable download button while playing', async () => {
      const user = userEvent.setup()
      render(<ChartPreview />)

      // Start animation
      const playButton = screen.getByRole('button', { name: '▶ Play Animation' })
      await user.click(playButton)

      // Check download button is disabled
      const downloadButton = screen.getByText('⬇ Download GIF').closest('button')
      expect(downloadButton).toBeDisabled()
    })
  })

  describe('different chart types', () => {
    it('should render with donut chart type', async () => {
      const donutChart = { ...mockChart, type: 'donut' as const }
      vi.mocked(useChartStore).mockImplementation((selector) => {
        const state = {
          chart: donutChart,
          updateThumbnail: mockUpdateThumbnail
        }
        return selector(state as unknown as ReturnType<typeof useChartStore.getState>)
      })

      render(<ChartPreview />)

      expect(document.querySelector('canvas')).toBeInTheDocument()
    })

    it('should render with circles chart type', async () => {
      const circlesChart = { ...mockChart, type: 'circles' as const }
      vi.mocked(useChartStore).mockImplementation((selector) => {
        const state = {
          chart: circlesChart,
          updateThumbnail: mockUpdateThumbnail
        }
        return selector(state as unknown as ReturnType<typeof useChartStore.getState>)
      })

      render(<ChartPreview />)

      expect(document.querySelector('canvas')).toBeInTheDocument()
    })
  })
})
