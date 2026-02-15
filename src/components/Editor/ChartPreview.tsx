import { useEffect, useRef, useState, useCallback } from 'react'
import { useChartStore } from '../../store/chartStore'
import { drawBarsChart } from '../Charts/BarsChart'
import { drawCirclesChart } from '../Charts/CirclesChart'
import { drawRectanglesChart } from '../Charts/RectanglesChart'
import { drawDonutChart } from '../Charts/DonutChart'
import {
  createAnimationController,
  exportToGif,
  downloadBlob,
  type AnimationController
} from '../../services/animation.service'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 400

export function ChartPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<AnimationController | null>(null)
  const chart = useChartStore((state) => state.chart)
  const updateThumbnail = useChartStore((state) => state.updateThumbnail)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const drawStaticChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas with white background for thumbnail
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Apply background
    if (chart.style.backgroundColor !== 'transparent') {
      ctx.fillStyle = chart.style.backgroundColor
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    // Draw chart based on type
    switch (chart.type) {
      case 'bars':
        drawBarsChart(ctx, chart, CANVAS_WIDTH, CANVAS_HEIGHT)
        break
      case 'circles':
        drawCirclesChart(ctx, chart, CANVAS_WIDTH, CANVAS_HEIGHT)
        break
      case 'rectangles':
        drawRectanglesChart(ctx, chart, CANVAS_WIDTH, CANVAS_HEIGHT)
        break
      case 'donut':
        drawDonutChart(ctx, chart, CANVAS_WIDTH, CANVAS_HEIGHT)
        break
      default:
        drawBarsChart(ctx, chart, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    // Save thumbnail as dataURL
    const thumbnail = canvas.toDataURL('image/png', 0.5)
    updateThumbnail(thumbnail)
  }, [chart, updateThumbnail])

  useEffect(() => {
    drawStaticChart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart.type, chart.title, chart.terms, chart.style, chart.valueType])

  function onPlayAnimation() {
    const canvas = canvasRef.current
    if (!canvas) return

    if (isPlaying && animationRef.current) {
      animationRef.current.stop()
      setIsPlaying(false)
      drawStaticChart()
      return
    }

    animationRef.current = createAnimationController(canvas, chart, () => {
      setIsPlaying(false)
    })
    animationRef.current.play()
    setIsPlaying(true)
  }

  async function onDownloadGif() {
    const canvas = canvasRef.current
    if (!canvas || isExporting) return

    setIsExporting(true)
    setExportProgress(0)

    try {
      const blob = await exportToGif(canvas, chart, (progress) => {
        setExportProgress(progress)
      })

      const filename = `${chart.title.replace(/[^a-zA-Z0-9]/g, '_')}_chart.gif`
      downloadBlob(blob, filename)
    } catch (error) {
      console.error('Failed to export GIF:', error)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  return (
    <div className="chart-preview">
      <h3>{chart.title}</h3>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      />
      <div className="chart-actions">
        <button
          type="button"
          className="btn-action"
          onClick={onPlayAnimation}
          disabled={isExporting}
        >
          {isPlaying ? '⏹ Stop' : '▶ Play Animation'}
        </button>
        <button
          type="button"
          className="btn-action btn-export"
          onClick={onDownloadGif}
          disabled={isPlaying || isExporting}
        >
          {isExporting ? `Exporting... ${Math.round(exportProgress * 100)}%` : '⬇ Download GIF'}
        </button>
      </div>
    </div>
  )
}
