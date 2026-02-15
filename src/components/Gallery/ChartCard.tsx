import type { Chart } from '../../types'

interface Props {
  chart: Chart
  onEdit: () => void
  onDelete: () => void
}

export function ChartCard({ chart, onEdit, onDelete }: Props) {
  const formattedDate = new Date(chart.updatedAt).toLocaleDateString()

  return (
    <article className="chart-card">
      <div className="card-thumbnail">
        {chart.thumbnail ? (
          <img src={chart.thumbnail} alt={chart.title} />
        ) : (
          <div className="no-thumbnail">
            <span>{chart.type}</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{chart.title}</h3>
        <div className="card-meta">
          <span className="chart-type-badge">{chart.type}</span>
          <span className="card-date">{formattedDate}</span>
        </div>
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={onEdit} title="Edit">
          Edit
        </button>
        <button className="btn-delete" onClick={onDelete} title="Delete">
          Delete
        </button>
      </div>
    </article>
  )
}
