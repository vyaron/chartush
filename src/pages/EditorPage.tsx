import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChartEditor } from '../components/Editor/ChartEditor'
import { useChartStore } from '../store/chartStore'

export function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const { loadFromGallery, resetChart } = useChartStore()

  useEffect(() => {
    if (id) {
      loadFromGallery(id)
    } else {
      resetChart()
    }
  }, [id, loadFromGallery, resetChart])

  return (
    <section className="editor-page main-layout full">
      <ChartEditor />
    </section>
  )
}
