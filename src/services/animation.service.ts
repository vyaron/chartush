import type { Chart } from '../types/chart.types'
import { calculatePercents } from './chart.service'
import GIF from 'gif.js'

const ANIMATION_DURATION = 2000 // 2 seconds
const ANIMATION_FPS = 30
const FRAME_COUNT = (ANIMATION_DURATION / 1000) * ANIMATION_FPS

// Easing function for smooth animation
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

// Calculate staggered progress for each item
// overlap: 0 = sequential, 1 = all together
function getStaggeredProgress(globalProgress: number, index: number, totalItems: number, overlap: number = 0.5): number {
  if (totalItems <= 1) return globalProgress
  
  const staggerAmount = 1 - overlap
  const itemDuration = 1 / (1 + staggerAmount * (totalItems - 1))
  const itemDelay = index * itemDuration * staggerAmount
  
  const itemProgress = (globalProgress - itemDelay) / itemDuration
  return Math.max(0, Math.min(1, itemProgress))
}

// Get contrast color for text readability
function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// ============================================
// ANIMATED DRAW FUNCTIONS
// ============================================

export function drawBarsAnimated(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  width: number,
  height: number,
  progress: number
): void {
  const { terms, style, valueType } = chart
  if (terms.length === 0) return

  const PADDING = 40
  const BAR_GAP = 20
  const LABEL_HEIGHT = 24

  const percents = calculatePercents(terms)
  const maxValue = Math.max(...terms.map((t) => t.value), 1)

  const chartWidth = width - PADDING * 2
  const chartHeight = height - PADDING * 2 - LABEL_HEIGHT
  const barWidth = (chartWidth - BAR_GAP * (terms.length - 1)) / terms.length

  ctx.font = `${style.fontSize} ${style.font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  terms.forEach((term, index) => {
    const itemProgress = getStaggeredProgress(progress, index, terms.length, 0.4)
    const easedItemProgress = easeOutCubic(itemProgress)

    const x = PADDING + index * (barWidth + BAR_GAP)
    const fullBarHeight = (term.value / maxValue) * chartHeight
    const barHeight = fullBarHeight * easedItemProgress
    const y = PADDING + chartHeight - barHeight

    // Draw bar
    ctx.fillStyle = term.color
    ctx.fillRect(x, y, barWidth, barHeight)

    // Draw value on top of bar (only when item is near complete)
    if (itemProgress > 0.7) {
      const textOpacity = (itemProgress - 0.7) / 0.3
      ctx.fillStyle = `rgba(51, 51, 51, ${textOpacity})`
      ctx.font = '14px Arial'
      const displayValue = valueType === 'percent' ? `${percents[index]}%` : term.value.toString()
      ctx.fillText(displayValue, x + barWidth / 2, y - 20)
    }

    // Draw label below bar (fade in with item)
    if (itemProgress > 0) {
      const labelOpacity = Math.min(1, itemProgress * 2)
      ctx.fillStyle = `rgba(51, 51, 51, ${labelOpacity})`
      ctx.font = '12px Arial'
      ctx.fillText(term.label, x + barWidth / 2, PADDING + chartHeight + 8)
    }
  })
}

export function drawCirclesAnimated(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  width: number,
  height: number,
  progress: number
): void {
  const { terms, valueType } = chart
  if (terms.length === 0) return

  const PADDING = 40
  const LABEL_HEIGHT = 40

  const percents = calculatePercents(terms)
  const maxValue = Math.max(...terms.map((t) => t.value), 1)

  const chartWidth = width - PADDING * 2
  const chartHeight = height - PADDING * 2 - LABEL_HEIGHT

  const maxRadius = Math.min(chartHeight / 2, chartWidth / (terms.length * 2))
  const spacing = chartWidth / terms.length
  const centerY = PADDING + chartHeight / 2

  terms.forEach((term, index) => {
    const itemProgress = getStaggeredProgress(progress, index, terms.length, 0.4)
    const easedItemProgress = easeOutCubic(itemProgress)

    const scaleFactor = Math.sqrt(term.value / maxValue)
    const fullRadius = maxRadius * scaleFactor
    const radius = fullRadius * easedItemProgress

    const centerX = PADDING + spacing * index + spacing / 2

    // Draw circle
    if (radius > 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = term.color
      ctx.fill()
    }

    // Draw value inside circle if big enough (only when item is near complete)
    if (radius > 20 && itemProgress > 0.7) {
      const textOpacity = (itemProgress - 0.7) / 0.3
      const contrastColor = getContrastColor(term.color)
      if (contrastColor === '#000000') {
        ctx.fillStyle = `rgba(0, 0, 0, ${textOpacity})`
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 14px Arial'
      const displayValue = valueType === 'percent' ? `${percents[index]}%` : term.value.toString()
      ctx.fillText(displayValue, centerX, centerY)
    }

    // Draw label below (fade in with item)
    if (itemProgress > 0) {
      const labelOpacity = Math.min(1, itemProgress * 2)
      ctx.fillStyle = `rgba(51, 51, 51, ${labelOpacity})`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.font = '12px Arial'
      ctx.fillText(term.label, centerX, PADDING + chartHeight + 8)
    }
  })
}

export function drawRectanglesAnimated(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  width: number,
  height: number,
  progress: number
): void {
  const { terms, valueType } = chart
  if (terms.length === 0) return

  const PADDING = 40
  const GAP = 2

  const percents = calculatePercents(terms)
  const total = terms.reduce((sum, term) => sum + term.value, 0)
  if (total === 0) return

  const chartWidth = width - PADDING * 2
  const chartHeight = height - PADDING * 2
  const totalGaps = GAP * (terms.length - 1)
  const availableWidth = chartWidth - totalGaps

  // Calculate all positions first
  const positions: number[] = []
  let xPos = PADDING
  terms.forEach((term) => {
    positions.push(xPos)
    const proportion = term.value / total
    const fullRectWidth = availableWidth * proportion
    xPos += fullRectWidth + GAP
  })

  terms.forEach((term, index) => {
    const itemProgress = getStaggeredProgress(progress, index, terms.length, 0.5)
    const easedItemProgress = easeOutCubic(itemProgress)

    const proportion = term.value / total
    const fullRectWidth = availableWidth * proportion
    const rectWidth = fullRectWidth * easedItemProgress
    const x = positions[index]
    const y = PADDING

    // Draw rectangle
    if (rectWidth > 0) {
      ctx.fillStyle = term.color
      ctx.fillRect(x, y, rectWidth, chartHeight)
    }

    // Draw label and value centered in rectangle (only when item is near complete)
    if (rectWidth > 30 && itemProgress > 0.7) {
      const textOpacity = (itemProgress - 0.7) / 0.3
      const contrastColor = getContrastColor(term.color)
      if (contrastColor === '#000000') {
        ctx.fillStyle = `rgba(0, 0, 0, ${textOpacity})`
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const centerX = x + rectWidth / 2
      const centerY = y + chartHeight / 2

      ctx.font = 'bold 14px Arial'
      ctx.fillText(term.label, centerX, centerY - 12)

      ctx.font = '12px Arial'
      const displayValue = valueType === 'percent' ? `${percents[index]}%` : term.value.toString()
      ctx.fillText(displayValue, centerX, centerY + 12)
    }
  })
}

export function drawDonutAnimated(
  ctx: CanvasRenderingContext2D,
  chart: Chart,
  width: number,
  height: number,
  progress: number
): void {
  const { terms, valueType } = chart
  if (terms.length === 0) return

  const LEGEND_HEIGHT = 80

  const percents = calculatePercents(terms)
  const total = terms.reduce((sum, term) => sum + term.value, 0)

  const chartHeight = height - LEGEND_HEIGHT
  const centerX = width / 2
  const centerY = chartHeight / 2
  const outerRadius = Math.min(centerX, centerY) - 20
  const innerRadius = outerRadius * 0.55

  // Calculate all start angles first
  const startAngles: number[] = []
  let angle = -Math.PI / 2
  terms.forEach((term) => {
    startAngles.push(angle)
    angle += (term.value / total) * Math.PI * 2
  })

  terms.forEach((term, index) => {
    const itemProgress = getStaggeredProgress(progress, index, terms.length, 0.6)
    const easedItemProgress = easeOutCubic(itemProgress)

    const startAngle = startAngles[index]
    const fullSliceAngle = (term.value / total) * Math.PI * 2
    const sliceAngle = fullSliceAngle * easedItemProgress
    const endAngle = startAngle + sliceAngle

    // Draw arc segment
    if (sliceAngle > 0) {
      ctx.beginPath()
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle)
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true)
      ctx.closePath()
      ctx.fillStyle = term.color
      ctx.fill()
    }

    // Draw percentage on slice if big enough (only when item is near complete)
    if (sliceAngle > 0.3 && itemProgress > 0.7) {
      const textOpacity = (itemProgress - 0.7) / 0.3
      const midAngle = startAngle + sliceAngle / 2
      const labelRadius = (outerRadius + innerRadius) / 2
      const labelX = centerX + Math.cos(midAngle) * labelRadius
      const labelY = centerY + Math.sin(midAngle) * labelRadius

      const contrastColor = getContrastColor(term.color)
      if (contrastColor === '#000000') {
        ctx.fillStyle = `rgba(0, 0, 0, ${textOpacity})`
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
      }
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = 'bold 12px Arial'
      ctx.fillText(`${percents[index]}%`, labelX, labelY)
    }
  })

  // Draw center text (only when near complete)
  if (progress > 0.5) {
    const textOpacity = (progress - 0.5) / 0.5
    ctx.fillStyle = `rgba(51, 51, 51, ${textOpacity})`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 16px Arial'
    ctx.fillText('Total', centerX, centerY - 10)
    ctx.font = 'bold 24px Arial'
    ctx.fillText(total.toString(), centerX, centerY + 14)
  }

  // Draw legend below
  drawLegendAnimated(ctx, terms, percents, valueType, width, chartHeight, progress)
}

function drawLegendAnimated(
  ctx: CanvasRenderingContext2D,
  terms: Chart['terms'],
  percents: number[],
  valueType: Chart['valueType'],
  width: number,
  startY: number,
  progress: number
): void {
  if (progress < 0.5) return

  const textOpacity = (progress - 0.5) / 0.5
  const legendY = startY + 20
  const itemWidth = width / terms.length

  terms.forEach((term, index) => {
    const x = itemWidth * index + itemWidth / 2

    // Color swatch
    ctx.fillStyle = term.color
    ctx.fillRect(x - 30, legendY, 12, 12)

    // Label
    ctx.fillStyle = `rgba(51, 51, 51, ${textOpacity})`
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.font = '12px Arial'
    ctx.fillText(term.label, x - 14, legendY + 6)

    // Value
    ctx.font = '10px Arial'
    const displayValue = valueType === 'percent' ? `${percents[index]}%` : term.value.toString()
    ctx.fillText(displayValue, x - 14, legendY + 22)
  })
}

// ============================================
// ANIMATION CONTROLLER
// ============================================

export interface AnimationController {
  play: () => void
  stop: () => void
  isPlaying: () => boolean
}

export function createAnimationController(
  canvas: HTMLCanvasElement,
  chart: Chart,
  onComplete?: () => void
): AnimationController {
  let animationId: number | null = null
  let playing = false

  const drawFrame = (progress: number) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Apply background
    if (chart.style.backgroundColor !== 'transparent') {
      ctx.fillStyle = chart.style.backgroundColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Draw chart based on type with progress
    switch (chart.type) {
      case 'bars':
        drawBarsAnimated(ctx, chart, canvas.width, canvas.height, progress)
        break
      case 'circles':
        drawCirclesAnimated(ctx, chart, canvas.width, canvas.height, progress)
        break
      case 'rectangles':
        drawRectanglesAnimated(ctx, chart, canvas.width, canvas.height, progress)
        break
      case 'donut':
        drawDonutAnimated(ctx, chart, canvas.width, canvas.height, progress)
        break
      default:
        drawBarsAnimated(ctx, chart, canvas.width, canvas.height, progress)
    }
  }

  const play = () => {
    if (playing) return

    playing = true
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1)

      drawFrame(progress)

      if (progress < 1) {
        animationId = requestAnimationFrame(animate)
      } else {
        playing = false
        animationId = null
        onComplete?.()
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  const stop = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    playing = false
    // Draw final frame
    drawFrame(1)
  }

  const isPlaying = () => playing

  return { play, stop, isPlaying }
}

// ============================================
// GIF EXPORT
// ============================================

export async function exportToGif(
  canvas: HTMLCanvasElement,
  chart: Chart,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvas.width,
      height: canvas.height,
      workerScript: '/gif.worker.js'
    })

    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const ctx = offscreenCanvas.getContext('2d')

    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }

    // Generate frames
    for (let i = 0; i <= FRAME_COUNT; i++) {
      const progress = i / FRAME_COUNT

      // Clear canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)

      // Apply background
      if (chart.style.backgroundColor !== 'transparent') {
        ctx.fillStyle = chart.style.backgroundColor
        ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height)
      }

      // Draw chart based on type with progress
      switch (chart.type) {
        case 'bars':
          drawBarsAnimated(ctx, chart, offscreenCanvas.width, offscreenCanvas.height, progress)
          break
        case 'circles':
          drawCirclesAnimated(ctx, chart, offscreenCanvas.width, offscreenCanvas.height, progress)
          break
        case 'rectangles':
          drawRectanglesAnimated(ctx, chart, offscreenCanvas.width, offscreenCanvas.height, progress)
          break
        case 'donut':
          drawDonutAnimated(ctx, chart, offscreenCanvas.width, offscreenCanvas.height, progress)
          break
        default:
          drawBarsAnimated(ctx, chart, offscreenCanvas.width, offscreenCanvas.height, progress)
      }

      // Add frame (delay in centiseconds)
      const delay = (ANIMATION_DURATION / FRAME_COUNT) / 10
      gif.addFrame(ctx, { copy: true, delay })
    }

    // Add a few static frames at the end
    for (let i = 0; i < 10; i++) {
      gif.addFrame(ctx, { copy: true, delay: 10 })
    }

    gif.on('progress', (p: number) => {
      onProgress?.(p)
    })

    gif.on('finished', (blob: Blob) => {
      resolve(blob)
    })

    gif.render()
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
