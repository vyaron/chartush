---
name: serviceLayer
description: Creating services, data persistence, localStorage, utility functions, and business logic in this React application.
---
# Service Layer Guidelines

When creating or modifying services in this application, follow these patterns:

## File Location
- Place services in `src/services/`
- Name files with `.service.ts` suffix (e.g., `chart.service.ts`)
- Create corresponding `.test.ts` file for tests

## Service Pattern
Services are pure functions, not classes. Export named functions:

```typescript
// chart.service.ts
import type { ChartData } from '../types/chart.types'

export function saveChart(chart: ChartData): void {
  const charts = loadCharts()
  charts.push(chart)
  localStorage.setItem('charts', JSON.stringify(charts))
}

export function loadCharts(): ChartData[] {
  const stored = localStorage.getItem('charts')
  return stored ? JSON.parse(stored) : []
}

export function deleteChart(id: string): void {
  const charts = loadCharts().filter(c => c.id !== id)
  localStorage.setItem('charts', JSON.stringify(charts))
}
```

## Data Persistence
- Use `localStorage` for client-side persistence
- Always handle JSON parse errors gracefully
- Return empty arrays/objects as defaults, never undefined

## Utility Functions
Place in `src/services/util.service.ts`:
- ID generation: `makeId(length?: number)`
- Random helpers: `getRandomColor()`, `getRandomInt(min, max)`
- Keep utilities pure and stateless

## Testing Services
```typescript
// chart.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { saveChart, loadCharts } from './chart.service'

describe('Chart Service', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should save and load charts', () => {
    const chart = { id: '1', name: 'Test' }
    saveChart(chart)
    expect(loadCharts()).toContainEqual(chart)
  })
})
```

## Type Safety
- Define types in `src/types/chart.types.ts`
- Use strict typing for all function parameters and returns
- Avoid `any` type
