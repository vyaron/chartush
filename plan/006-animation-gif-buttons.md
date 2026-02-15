# Plan 006: Add Play Animation & Download GIF Buttons

## Overview
Add two new buttons to the chart editor:
1. **Play Animation** - Animate the chart drawing on the canvas
2. **Download GIF** - Export the animation as a GIF file

## Current State
- Charts are drawn statically on a canvas (600x400)
- Chart types: `bars`, `circles`, `rectangles`, `donut`
- Each chart type has its own drawing function in `src/components/Charts/`
- Preview is in `ChartPreview.tsx` with a single `useEffect` for static rendering

---

## Questions

### 1. Animation Style
What animation style would you prefer for each chart type?

**Option A - Growth Animation (Recommended)**
- Bars: Grow from bottom to full height
- Circles: Scale from 0 to full radius
- Rectangles: Scale/grow effect
- Donut: Arc sweep from 0° to full angle

OK.

**Option B - Sequential Reveal**
- Each item appears one after another with a fade-in/scale effect

**Option C - Both options**
- User can choose animation style in the editor

---

### 2. Button Placement
Where should the buttons be placed?

**Option A - Below the canvas** (in ChartPreview component)
**Option B - In the EditorPanel** (alongside Save button)
**Option C - Floating toolbar above/over the canvas**


A

---

### 3. GIF Library
Which approach for GIF generation?

**Option A - gif.js** (Popular, runs in web worker, larger bundle size ~300KB)
**Option B - modern-gif** (Modern, lighter, uses OffscreenCanvas)
**Option C - gifshot** (Simple API, captures from canvas)

A

---

### 4. Animation Duration
What should be the default animation/GIF duration?

**Option A - 1 second**
**Option B - 2 seconds** (Recommended)
**Option C - 3 seconds**
**Option D - Configurable in editor**

---
B

## Implementation Steps (After Questions Answered)

1. ✅ Create animation service (`animation.service.ts`)
2. ✅ Add animated draw functions for each chart type
3. ✅ Update `ChartPreview.tsx` with animation state and controls
4. ✅ Add "Play Animation" button with play/stop toggle
5. ✅ Integrate GIF library
6. ✅ Add "Download GIF" button with loading state
7. ✅ Style new buttons
8. Test all chart types with animations

---

## Files Changed

- `src/services/animation.service.ts` - NEW: Animation controller and GIF export
- `src/components/Editor/ChartPreview.tsx` - Added Play/Download buttons
- `src/style/cmps/editor.css` - Added button styles
- `public/gif.worker.js` - Copied from node_modules for GIF generation
- `package.json` - Added gif.js dependency

---

**Waiting for your answers before proceeding!**
