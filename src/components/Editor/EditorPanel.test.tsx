import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorPanel } from './EditorPanel'
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

const mockUpdateTitle = vi.fn()
const mockUpdateType = vi.fn()
const mockAddTerm = vi.fn()
const mockUpdateTerm = vi.fn()
const mockRemoveTerm = vi.fn()
const mockSaveToGallery = vi.fn()

vi.mock('../../store/chartStore', () => ({
  useChartStore: vi.fn()
}))

describe('EditorPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useChartStore).mockReturnValue({
      chart: mockChart,
      updateTitle: mockUpdateTitle,
      updateType: mockUpdateType,
      addTerm: mockAddTerm,
      updateTerm: mockUpdateTerm,
      removeTerm: mockRemoveTerm,
      saveToGallery: mockSaveToGallery
    })
  })

  describe('rendering', () => {
    it('should render the editor panel', () => {
      render(<EditorPanel />)

      expect(screen.getByRole('complementary')).toHaveClass('editor-panel')
      expect(screen.getByRole('heading', { name: 'Chart Editor' })).toBeInTheDocument()
    })

    it('should render title input with current value', () => {
      render(<EditorPanel />)

      const titleInput = screen.getByLabelText('Title')
      expect(titleInput).toHaveValue('Test Chart')
    })

    it('should render chart type selector', () => {
      render(<EditorPanel />)

      const typeSelector = screen.getByLabelText('Type')
      expect(typeSelector).toHaveValue('bars')
    })

    it('should render all chart type options', () => {
      render(<EditorPanel />)

      expect(screen.getByRole('option', { name: 'Bars' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Circles' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Rectangles' })).toBeInTheDocument()
      expect(screen.getByRole('option', { name: 'Donut' })).toBeInTheDocument()
    })

    it('should render term items', () => {
      render(<EditorPanel />)

      const termInputs = screen.getAllByPlaceholderText('Label')
      expect(termInputs).toHaveLength(2)
      expect(termInputs[0]).toHaveValue('Item 1')
      expect(termInputs[1]).toHaveValue('Item 2')
    })

    it('should render save button', () => {
      render(<EditorPanel />)

      expect(screen.getByRole('button', { name: 'Save to Gallery' })).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call updateTitle when title changes', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const titleInput = screen.getByLabelText('Title')
      await user.clear(titleInput)
      await user.type(titleInput, 'New Title')

      expect(mockUpdateTitle).toHaveBeenCalled()
    })

    it('should call updateType when chart type changes', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const typeSelector = screen.getByLabelText('Type')
      await user.selectOptions(typeSelector, 'circles')

      expect(mockUpdateType).toHaveBeenCalledWith('circles')
    })

    it('should call addTerm when add button clicked', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const addButton = screen.getByRole('button', { name: '+ Add Item' })
      await user.click(addButton)

      expect(mockAddTerm).toHaveBeenCalled()
    })

    it('should call updateTerm when term label changes', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const labelInputs = screen.getAllByPlaceholderText('Label')
      await user.clear(labelInputs[0])
      await user.type(labelInputs[0], 'New Label')

      expect(mockUpdateTerm).toHaveBeenCalled()
    })

    it('should call updateTerm when term value changes', () => {
      render(<EditorPanel />)

      const valueInputs = screen.getAllByPlaceholderText('Value')
      fireEvent.change(valueInputs[0], { target: { value: '100' } })

      expect(mockUpdateTerm).toHaveBeenCalledWith(0, { value: 100 })
    })

    it('should call removeTerm when remove button clicked', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const removeButtons = screen.getAllByTitle('Remove item')
      await user.click(removeButtons[0])

      expect(mockRemoveTerm).toHaveBeenCalledWith(0)
    })

    it('should call saveToGallery when save button clicked', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const saveButton = screen.getByRole('button', { name: 'Save to Gallery' })
      await user.click(saveButton)

      expect(mockSaveToGallery).toHaveBeenCalled()
    })
  })

  describe('remove button state', () => {
    it('should disable remove button when only one term exists', () => {
      const singleTermChart = {
        ...mockChart,
        terms: [{ label: 'Item 1', value: 50, color: '#ff0000' }]
      }
      vi.mocked(useChartStore).mockReturnValue({
        chart: singleTermChart,
        updateTitle: mockUpdateTitle,
        updateType: mockUpdateType,
        addTerm: mockAddTerm,
        updateTerm: mockUpdateTerm,
        removeTerm: mockRemoveTerm,
        saveToGallery: mockSaveToGallery
      })

      render(<EditorPanel />)

      const removeButton = screen.getByTitle('Remove item')
      expect(removeButton).toBeDisabled()
    })

    it('should enable remove buttons when multiple terms exist', () => {
      render(<EditorPanel />)

      const removeButtons = screen.getAllByTitle('Remove item')
      removeButtons.forEach(button => {
        expect(button).not.toBeDisabled()
      })
    })
  })

  describe('save feedback', () => {
    it('should show saved feedback after saving', async () => {
      const user = userEvent.setup()
      render(<EditorPanel />)

      const saveButton = screen.getByRole('button', { name: 'Save to Gallery' })
      await user.click(saveButton)

      expect(screen.getByRole('button', { name: '✓ Saved!' })).toBeInTheDocument()
    })
  })
})
