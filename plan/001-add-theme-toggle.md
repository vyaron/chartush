# Plan: Add Light/Dark Theme Toggle

## Current State
- Project uses CSS variables in `src/style/setup/var.css` (currently dark theme only)
- State management with Zustand in `src/store/appStore.ts`
- Header with navigation in `src/layouts/RootLayout.tsx`

## Implementation Steps

### 1. Extend CSS Variables
Add light theme variants in `var.css`:
```css
:root {
    /* Dark theme (default) */
    --clr-primary: #646cff;
    --clr-primary-hover: #535bf2;
    --clr-bg: #242424;
    --clr-bg-light: #1a1a1a;
    --clr-text: rgba(255, 255, 255, 0.87);
    --clr-text-muted: rgba(255, 255, 255, 0.6);
    --clr-border: rgba(255, 255, 255, 0.1);
}

[data-theme="light"] {
    --clr-bg: #ffffff;
    --clr-bg-light: #f5f5f5;
    --clr-text: rgba(0, 0, 0, 0.87);
    --clr-text-muted: rgba(0, 0, 0, 0.6);
    --clr-border: rgba(0, 0, 0, 0.1);
}
```

### 2. Add Theme State to Store
Extend `appStore.ts` with theme state and toggle function:
- `theme: 'light' | 'dark'`
- `toggleTheme()` action
- Initialize from localStorage if available

### 3. Create Theme Toggle Button
Add a toggle button in the header (RootLayout.tsx):
- Display current theme state (sun/moon icon or text)
- Call `toggleTheme()` on click

### 4. Sync Theme with DOM
Apply `data-theme` attribute to `<html>` element when theme changes.

### 5. Persist Theme Preference
Save theme to localStorage so it persists across sessions.

---

## Decisions

1. **Theme detection**: Yes - detect system preference on first visit
2. **Toggle style**: Icon only (sun/moon)
3. **Default theme**: Dark
4. **Priority**: localStorage > system preference > dark (fallback)

## Implementation Status
- [x] Plan finalized
- [x] CSS variables with light theme
- [x] Theme service (localStorage persistence)
- [x] Store with theme state
- [x] Toggle button in header
