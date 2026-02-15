export type ChartType = 'circles' | 'bars' | 'rectangles' | 'donut'

export type ValueType = 'value' | 'percent'

export interface ChartStyle {
  font: string
  fontSize: string
  backgroundColor: string
}

export interface ChartTerm {
  label: string
  value: number
  color: string
}

export interface Chart {
  id: string
  type: ChartType
  title: string
  style: ChartStyle
  valueType: ValueType
  terms: ChartTerm[]
  thumbnail?: string
  createdAt: number
  updatedAt: number
}

export type ChartCreate = Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>
