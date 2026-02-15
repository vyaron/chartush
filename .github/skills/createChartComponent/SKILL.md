---
name: createChartComponent
description: Creating new chart types, chart components, or extending chart functionality in this React charting application.
---
# Mister Charts Component Guidelines

When creating new chart components or chart types for this application, follow these conventions:

## File Structure
- Place chart-related components in `src/components/Editor/`
- Use TypeScript with `.tsx` extension
- Create corresponding test file with `.test.tsx` suffix

## Component Pattern
```tsx
import type { ChartData } from '../../types/chart.types'

interface Props {
  data: ChartData
  // additional props
}

export function MyChartComponent({ data }: Props) {
  // Component implementation
}
```

## Chart Types
- Chart types are defined in `src/types/chart.types.ts`
- Register new types in `src/services/chart.service.ts` via `getChartTypes()`
- Add corresponding SVG icon to `public/img/chart/{type}.svg`

## Canvas Drawing
- Use HTML Canvas for rendering charts
- Support animation via the `useAnimation` hook
- Implement `drawChart(ctx, data, progress)` pattern where progress is 0-1

## Testing
- Use Vitest + React Testing Library
- Mock canvas context in tests
- Test user interactions and accessibility