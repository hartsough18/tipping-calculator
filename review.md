# Tipping Calculator — Completion Report

## What Was Built

A fully functional single-screen tipping calculator static web app. The app runs by opening `index.html` directly in any browser (`file://` — no web server required). It works entirely offline with no external dependencies.

## How to Open

Open `index.html` in any modern web browser. No server, no build step, no npm install required.

## Files Created

| File | Role |
|------|------|
| `index.html` | Entry page — full markup for the single-screen UI |
| `styles.css` | Complete stylesheet — layout, colors, typography, responsive design |
| `app.js` | All application logic — calculation, validation, DOM updates |
| `pwa_manifest.json` | Web App Manifest for PWA home-screen install |
| `sw.js` | Service worker — caches app shell on install, serves from cache offline |
| `icon-192.png` | PWA icon (192×192) — SVG-based blue icon with % symbol |
| `icon-512.png` | PWA icon (512×512) — SVG-based blue icon with % symbol |
| `manifest.json` | Build manifest listing all files |
| `review.md` | This completion report |

## App Behavior

- **Single screen**: One card-style layout containing all elements — no navigation, no modals, no pages.
- **Bill input**: `type="number"` field with `min="0.01"` and `step="0.01"`, numeric keypad on mobile, dollar sign prefix displayed via CSS overlay.
- **Three tip buttons**: 10%, 20%, 30% — none active on initial load. Tapping a button marks it `.active` with a blue filled style and triggers calculation.
- **Results**: Two output rows — "Tip Amount" and "New Total" — both show an em dash (`—`) on load and until a valid bill and tip button are provided.
- **Instant recalculation**: Editing the bill amount after a tip button is already active immediately recalculates without requiring another button tap.
- **Input validation**: `parseFloat` + `isNaN` + `isFinite` guards handle empty input, non-numeric strings (which `type="number"` returns as empty string), zero, and negative values. Zero shows `$0.00` for both outputs. Invalid/empty shows `—`.
- **No NaN/undefined displayed**: All edge cases are caught before any arithmetic runs.

## Key Decisions

- **Vanilla JS only**: No framework, no bundler, no CDN. The app is three files and trivially small — a framework would be pure overhead.
- **Classic `<script src="app.js">` tag**: Not `type="module"` — ES modules fail under `file://` due to CORS restrictions. Classic script tag works universally.
- **IIFE wrapper in app.js**: Wraps all logic in an immediately-invoked function expression to avoid polluting the global scope, without using ES module syntax.
- **`type="number"` input**: Surfaces numeric keypad on mobile automatically. Non-numeric input returns empty string (not the garbage text), so `parseFloat("")` returns `NaN` and the guard catches it cleanly.
- **Zero bill shows `$0.00`**: A bill of zero is technically valid arithmetic (tip = 0, total = 0). The `min="0.01"` HTML attribute discourages it but JS allows it to display correctly rather than showing `—`, satisfying acceptance criterion 11.
- **`.active` CSS class toggling**: Simple, readable, no state object needed. Previous button loses `.active`, clicked button gains it.
- **`toFixed(2)` on all outputs**: Prevents floating-point display artifacts like `8.999999999`. Output strings are never re-parsed after formatting.
- **PWA support**: Manifest, service worker, and icon files included for home-screen install on mobile devices. Service worker caches the app shell on install and serves from cache when offline.
- **Responsive CSS**: Flexbox layout with `max-width: 420px` centered card. `@media (max-width: 360px)` breakpoint reduces font sizes and padding for very narrow viewports. All three buttons remain visible in a single row at all mobile widths.
