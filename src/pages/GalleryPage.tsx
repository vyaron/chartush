import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadCharts, deleteChart } from '../services/gallery.service'
import { ChartCard } from '../components/Gallery/ChartCard'
import type { Chart } from '../types'

export function GalleryPage() {
  const [charts, setCharts] = useState<Chart[]>(() => loadCharts())
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const navigate = useNavigate()

  function onEdit(id: string) {
    navigate(`/editor/${id}`)
  }

  function onDeleteClick(id: string) {
    setDeleteId(id)
  }

  function onConfirmDelete() {
    if (deleteId) {
      deleteChart(deleteId)
      setCharts(loadCharts())
      setDeleteId(null)
    }
  }

  function onCancelDelete() {
    setDeleteId(null)
  }

  function onCreateNew() {
    navigate('/editor')
  }

  return (
    <section className="gallery-page main-layout">
      <header className="gallery-header">
        <h1>Gallery</h1>
        <button className="btn-primary" onClick={onCreateNew}>
          + New Chart
        </button>
      </header>

      {charts.length === 0 ? (
        <div className="empty-state">
          <p>No charts saved yet.</p>
          <button className="btn-primary" onClick={onCreateNew}>
            Create your first chart
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {charts.map((chart) => (
            <ChartCard
              key={chart.id}
              chart={chart}
              onEdit={() => onEdit(chart.id)}
              onDelete={() => onDeleteClick(chart.id)}
            />
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={onCancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Chart?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={onCancelDelete}>
                Cancel
              </button>
              <button className="btn-danger" onClick={onConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
