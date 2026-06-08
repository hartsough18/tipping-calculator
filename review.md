# Tipping Calculator — Completion Report

## What Was Built

A fully functional tipping calculator static web app with a history view. The app runs by opening `index.html` directly in any browser (`file://` — no web server required). It works entirely offline with no external dependencies.

## How to Open

Open `index.html` in any modern web browser. No server, no build step, no npm install required.

## Files

| File | Role |
|------|------|
| `index.html` | Entry page — full markup for calculator and history views |
| `styles.css` | Complete stylesheet — dark/light theme tokens, full-screen layout, large thumb-friendly buttons |
| `app.js` | All application logic — tip calculation, history tracking, view switching |
| `pwa_manifest.json` | Web App Manifest for PWA home-screen install |
| `sw.js` | Service worker — caches app shell on install, serves from cache offline |
| `icon-192.png` | PWA icon (192×192) |
| `icon-512.png` | PWA icon (512×512) |
| `manifest.json` | Build manifest listing all files |
| `review.md` | This completion report |

## Changes Made in This Iteration

### Removed Header
- The `<header>` element and its `<h1>` title were removed entirely from `index.html`.
- All header CSS rules were removed from `styles.css`.
- The History button at the top of the card serves as the sole top navigation affordance.

### Full-Screen Layout
- The card now uses `min-height: 100vh` and `flex: 1` to fill the entire viewport height.
- Body padding removed; container stretches to full height.
- `max-width` increased to 480px for a wider feel on larger phones.

### Larger, Thumb-Friendly Buttons
- Tip buttons: `padding` increased to `22px 8px`, `font-size` to `1.4rem`, `font-weight` to `800`, `min-height` set to `72px`.
- Bill input: `font-size` increased to `2rem`, `padding` increased to `20px`.
- Result values: `font-size` increased to `1.75rem`, `font-weight` to `800`, row padding increased to `22px 24px`.
- Border radius increased on card elements for a more modern feel.

### History Feature
- Added a "History" button in the top-right of the card (sole navigation affordance, no separate header).
- Added a history view panel (hidden by default) showing up to the last 5 calculations, newest first.
- Each history entry shows: bill amount, tip percentage, tip amount, and new total.
- When no calculations have been made, "No history yet" is displayed.
- A "← Calculator" back button returns to the calculator view with all state (bill value, active tip button, results) preserved.
- History is in-memory only — cleared on page reload (no localStorage).
- Valid calculations (positive bill, selected tip %) are saved to history; invalid inputs (empty, zero, negative, non-numeric) are not recorded.

### Removed Features (per delta plan)
- Removed: mode toggle between tip calculator and basic arithmetic calculator.
- Removed: basic arithmetic calculator panel and all its JS logic.
- Removed: Number of People input and Per Person output.
- Removed: Clear button.
- These were present in the previous iteration but are not part of the current acceptance criteria.

## Key Decisions

- **No header**: The History button is the only top-level navigation element, satisfying the criterion that no separate header is visible above the calculator UI.
- **Full-height card**: Using `min-height: 100vh` on the card and `flex: 1` on the container ensures the calculator fills the screen on all device sizes.
- **History stored newest-first**: `unshift()` prepends each new entry so the most recent calculation always appears at the top of the list.
- **History capped at 5**: After each save, the array is sliced to 5 entries maximum.
- **Calculator state preserved on history navigation**: The bill input value, active tip button `.active` class, and displayed results are all DOM state that persists when the calc view is hidden/shown — no re-render needed.
- **Invalid inputs not saved to history**: The `saveToHistory()` call is inside the valid-calculation branch only (after the `bill <= 0` guard), so zero, negative, empty, and non-numeric inputs never produce a history entry.
- **Dark mode default**: `data-theme="dark"` on `<html>` ensures dark mode loads immediately with no flash.
- **Vanilla JS only**: No framework, no bundler, no CDN. Classic `<script src="app.js">` tag for `file://` compatibility.
