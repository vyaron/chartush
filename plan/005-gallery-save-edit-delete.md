# Plan: Gallery Page with Save, Edit, Delete

## Overview
Add a Gallery page to display saved charts from localStorage, with ability to edit existing charts and delete them.

## Current State
- ✅ `gallery.service.ts` already exists with `saveChart`, `loadCharts`, `loadChart`, `deleteChart`
- ✅ `chartStore.ts` has `setChart` action to load a chart for editing
- ✅ Editor works with current chart in store
- Need: Gallery page, save button, edit/delete actions

## Architecture

### Data Flow
```
Editor                          Gallery
+------------------+           +------------------+
|  Edit Chart      |  --save-> |  View Charts     |
|  [Save Button]   |           |  [Edit] [Delete] |
+------------------+           +------------------+
        ^                              |
        |                              |
        +------------ edit ------------+
```

### Components to Create
```
src/
  pages/
    GalleryPage.tsx          # Gallery route
  components/
    Gallery/
      GalleryGrid.tsx        # Grid of chart cards
      ChartCard.tsx          # Single chart thumbnail + actions
```

### Store Updates
Add to `chartStore.ts`:
- `saveToGallery()` - save current chart using gallery.service
- `loadFromGallery(id)` - load chart by ID for editing

---

## Questions

1. **Gallery layout?** A
   - A) Grid of cards with thumbnails (recommended)
   - B) List view with details
   - C) Both with toggle

2. **Thumbnail rendering?** - dataurl image
   - A) Mini canvas preview of the actual chart (recommended)
   - B) Static icon based on chart type
   - C) No preview, just text info

3. **Save behavior in editor?** A
   - A) "Save" button that saves and stays in editor
   - B) "Save & Close" that navigates to gallery after save
   - C) Both buttons available

4. **Edit behavior?** B
   - A) Click edit → load chart → navigate to /editor
   - B) Click edit → navigate to /editor/:id (URL-based)
   - C) Edit in modal overlay

5. **Confirm delete?** A
   - A) Yes, show confirmation dialog
   - B) No, delete immediately (can add undo later)

---

## Implementation Steps

### Step 1: Update chartStore ✅
- Add `saveToGallery()` action
- Add `loadFromGallery(id: string)` action
- Add `updateThumbnail()` action

### Step 2: Create GalleryPage ✅
File: `src/pages/GalleryPage.tsx`
- Load charts from gallery.service
- Render gallery grid with ChartCard components
- Show empty state if no charts
- Delete confirmation modal

### Step 3: Create ChartCard ✅
File: `src/components/Gallery/ChartCard.tsx`
- Thumbnail from dataURL image
- Chart title and type badge
- Edit and Delete buttons
- Updated date

### Step 4: Add Save Button to Editor ✅
File: `src/components/Editor/EditorPanel.tsx`
- "Save to Gallery" button
- Show "✓ Saved!" feedback for 2 seconds

### Step 5: Update ChartPreview for thumbnails ✅
File: `src/components/Editor/ChartPreview.tsx`
- Capture canvas as dataURL after render
- Store thumbnail in chart state

### Step 6: Wire Up Edit Action ✅
- URL-based: `/editor/:id`
- EditorPage loads chart from gallery on mount

### Step 7: Wire Up Delete Action ✅
- Confirmation modal
- Call `deleteChart(id)` from gallery.service
- Refresh gallery list

### Step 8: Add Route and Navigation ✅
- Add `/gallery` and `/editor/:id` routes in App.tsx
- Add "Gallery" link in header

### Step 9: CSS Styling ✅
File: `src/style/cmps/gallery.css`
- Grid layout for cards
- Card styling with hover effects
- Modal styles
- Button variants

---

## Status: COMPLETED ✅

Gallery feature is fully implemented:
- Save charts to localStorage with thumbnail
- View saved charts in grid layout
- Edit existing charts via `/editor/:id`
- Delete charts with confirmation dialog
