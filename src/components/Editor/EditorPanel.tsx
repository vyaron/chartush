import { useState } from 'react'
import { useChartStore } from '../../store/chartStore'
import type { ChartType } from '../../types'

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bars', label: 'Bars' },
  { value: 'circles', label: 'Circles' },
  { value: 'rectangles', label: 'Rectangles' },
  { value: 'donut', label: 'Donut' }
]

export function EditorPanel() {
  const [saved, setSaved] = useState(false)
  const {
    chart,
    updateTitle,
    updateType,
    addTerm,
    updateTerm,
    removeTerm,
    saveToGallery
  } = useChartStore()

  function onTitleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    updateTitle(ev.target.value)
  }

  function onTypeChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    updateType(ev.target.value as ChartType)
  }

  function onTermLabelChange(index: number, label: string) {
    updateTerm(index, { label })
  }

  function onTermValueChange(index: number, value: number) {
    updateTerm(index, { value })
  }

  function onTermColorChange(index: number, color: string) {
    updateTerm(index, { color })
  }

  function onAddTerm() {
    addTerm()
  }

  function onRemoveTerm(index: number) {
    removeTerm(index)
  }

  function onSave() {
    saveToGallery()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <aside className="editor-panel">
      <h2>Chart Editor</h2>

      <div className="form-group">
        <label htmlFor="chart-title">Title</label>
        <input
          id="chart-title"
          type="text"
          value={chart.title}
          onChange={onTitleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="chart-type">Type</label>
        <select
          id="chart-type"
          value={chart.type}
          onChange={onTypeChange}
        >
          {CHART_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Items</label>
        <ul className="term-list">
          {chart.terms.map((term, index) => (
            <li key={index} className="term-item">
              <input
                type="color"
                value={term.color}
                onChange={(ev) => onTermColorChange(index, ev.target.value)}
                title="Color"
              />
              <input
                type="text"
                value={term.label}
                onChange={(ev) => onTermLabelChange(index, ev.target.value)}
                placeholder="Label"
              />
              <input
                type="number"
                value={term.value}
                onChange={(ev) => onTermValueChange(index, Number(ev.target.value))}
                min={0}
                placeholder="Value"
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => onRemoveTerm(index)}
                disabled={chart.terms.length <= 1}
                title="Remove item"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className="btn-add" onClick={onAddTerm}>
          + Add Item
        </button>
      </div>

      <button type="button" className="btn-save" onClick={onSave}>
        {saved ? '✓ Saved!' : 'Save to Gallery'}
      </button>
    </aside>
  )
}
