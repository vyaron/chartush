import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChartEditor } from './ChartEditor'

// Mock child components
vi.mock('./EditorPanel', () => ({
  EditorPanel: () => <div data-testid="editor-panel">EditorPanel</div>
}))

vi.mock('./ChartPreview', () => ({
  ChartPreview: () => <div data-testid="chart-preview">ChartPreview</div>
}))

describe('ChartEditor', () => {
  it('should render the chart editor container', () => {
    render(<ChartEditor />)

    const container = document.querySelector('.chart-editor')
    expect(container).toBeInTheDocument()
  })

  it('should render EditorPanel component', () => {
    render(<ChartEditor />)

    expect(screen.getByTestId('editor-panel')).toBeInTheDocument()
  })

  it('should render ChartPreview component', () => {
    render(<ChartEditor />)

    expect(screen.getByTestId('chart-preview')).toBeInTheDocument()
  })

  it('should render both panel and preview side by side', () => {
    render(<ChartEditor />)

    expect(screen.getByTestId('editor-panel')).toBeInTheDocument()
    expect(screen.getByTestId('chart-preview')).toBeInTheDocument()
  })
})
