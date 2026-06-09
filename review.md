# Tipping Calculator — Completion Report

## What Was Built

A fully functional tipping calculator and basic arithmetic calculator static web app. The app runs by opening `index.html` directly in any modern browser (`file://` — no web server required). It works entirely offline with no external dependencies.

## How to Open

Open `index.html` in any modern web browser. No server, no build step, no npm install required.

## Files

| File | Role |
|------|------|
| `index.html` | Entry page — full markup for both calculator panels and history overlay popup |
| `styles.css` | Complete stylesheet — dark/light theme tokens, layout, responsive design, viewport locking |
| `app.js` | All application logic — tip calculation, split bill, basic calculator, mode toggle, history overlay |
| `pwa_manifest.json` | Web App Manifest for PWA home-screen install |
| `sw.js` | Service worker — caches app shell on install, generates calculator-graphic PNG icons via OffscreenCanvas, serves from cache offline |
| `icon-192.png` | PWA icon (192×192) — calculator graphic |
| `icon-512.png` | PWA icon (512×512) — calculator graphic |
| `favicon.svg` | Browser tab favicon — calculator graphic SVG |
| `generate-icons.html` | Utility page to regenerate PNG icons via Canvas if needed |
| `manifest.json` | Build manifest listing all files |
| `review.md` | This completion report |

## Changes Made in This Iteration

### Tab Order Fixed: Calculator Left, Tip Calculator Right
- In `index.html`, the mode toggle bar now reads: "Calculator" (left, `id="tab-calc"`) | "Tip Calculator" (right, `id="tab-tip"`).
- The basic calculator panel (`#calc-panel`) is the first panel in the DOM and active by default.
- The tip calculator panel (`#tip-panel`) is second and hidden by default.
- `app.js` tab event listeners updated to match the new IDs and default state.

### Dark Mode Toggle Bar Fixed
- Both light and dark theme `:root` / `[data-theme="dark"]` now use `--color-mode-tab-bg: #334155` and `--color-mode-tab-text: #94a3b8` so the toggle bar is dark-colored in dark mode, consistent with the overall dark theme.

### History Panel Converted to Floating Overlay Popup
- Removed the inline `#calc-history-panel` div from inside the calculator grid area.
- Added a `#history-overlay` fixed-position overlay outside the main card, containing:
  - `.history-backdrop` — a semi-transparent dimmed backdrop covering the full screen.
  - `.history-popup` — a centered floating card with header, close (×) button, and history list.
- Tapping the backdrop or the × button closes the popup.
- The calculator layout beneath does not shift when the popup opens — it is a true overlay.
- `app.js` updated: `openHistory()`, `closeHistory()`, `toggleHistory()` now control the overlay element. Backdrop click and close-button click both call `closeHistory()`.

### Equals Button Full Width
- In `index.html`, the equals button has class `calc-equals-full` added.
- In `styles.css`, `.calc-equals-full` sets `grid-column: 1 / -1` and `border-radius: 39px; width: 100%` so it spans all four columns of the button grid.
- The "Last 5", zero (span 2), and decimal buttons occupy the row above; the equals button occupies its own full-width row at the bottom.

### Viewport Locked — No Vertical Scroll
- `html, body` now have `height: 100%; overflow: hidden; touch-action: none; overscroll-behavior: none;`.
- `.container` uses `height: 100%; max-height: 100vh; overflow: hidden;`.
- `.card` uses `flex: 1; min-height: 0; overflow: hidden;`.
- `#calc-panel` and `#tip-panel` use `flex: 1; min-height: 0; overflow: hidden;`.
- `.calc-grid` uses `flex: 1; min-height: 0;` with fractional rows (`grid-template-rows: repeat(5, 1fr)`) so buttons fill available height proportionally.
- No content overflows the screen on 375×667 or 390×844 viewports.

### Calculator Graphic Icons
- `favicon.svg` added: an SVG depicting a blue rounded-rectangle calculator with a display bar and a 3×2 grid of buttons (last button accent-colored for equals). Used as `<link rel="icon">` in `index.html`.
- `sw.js` updated: on service worker install, `generateCalcIcon()` uses `OffscreenCanvas` to draw the same calculator graphic at 192px and 512px and stores the resulting PNG blobs in the cache, replacing any previously cached percent-symbol icons.
- `generate-icons.html` added: a utility page that draws the same calculator graphic on two `<canvas>` elements and provides download links for `icon-192.png` and `icon-512.png`, so the actual PNG files on disk can be regenerated if needed.
- `pwa_manifest.json` updated: `background_color` changed to `#0f172a` (dark), `theme_color` to `#3b82f6` (blue), icon `purpose` set to `"any maskable"`.

## Preserved Features

- **Tip calculation**: bill input, 10%/20%/30% buttons, active state highlight, `—` default placeholders, auto-recalculate on input change, per-person split, clear button — all unchanged.
- **Basic calculator**: all arithmetic operations (+, −, ×, ÷), negate, percent, decimal, AC reset, divide-by-zero error handling, operator highlight — all unchanged.
- **History**: up to 5 most recent calculations stored in session memory, rendered in the popup, most recent first. History persists across tab switches.
- **Dark mode default**: `data-theme="dark"` on `<html>`, dark CSS tokens applied on load.
- **PWA installability**: manifest, service worker, and icons all present and correctly referenced.
- **No header**: no `<header>` element anywhere in the app.
- **Offline support**: service worker caches app shell on install and serves from cache when offline.

## Key Decisions

- **Overlay popup instead of inline panel**: The history popup is a `position: fixed` overlay so it never affects document flow or layout. The calculator grid stays exactly in place when the popup opens.
- **SVG favicon**: An inline SVG file is the most reliable cross-browser favicon format and requires no build step. It renders the calculator graphic at any resolution.
- **OffscreenCanvas in service worker for PNG icons**: Since we cannot run Node.js or a build step, the service worker generates the PNG icons programmatically on first install using `OffscreenCanvas`. This ensures the installed PWA icon is a calculator graphic, not a percent symbol.
- **`grid-template-rows: repeat(5, 1fr)` on calc grid**: Combined with `flex: 1` on the grid container, this makes all button rows share the available height equally, preventing overflow on small screens.
- **Tab order**: Calculator on left, Tip Calculator on right — matching the acceptance criterion exactly.
