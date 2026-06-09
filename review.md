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

### Calculator Button Proportions — Circular Digit/Operator Buttons

- Added `aspect-ratio: 1 / 1` to `.calc-btn` so every standard digit and operator button renders as a perfect circle regardless of the grid row height. Also added `justify-self: center; align-self: center` so each button centers within its grid cell.
- The equals button (`.calc-equals-full`) overrides `aspect-ratio: unset`, `justify-self: stretch`, and `align-self: stretch` so it remains a wide rectangular pill filling its full row width.
- The zero button (`.calc-zero`) similarly overrides `aspect-ratio: unset` and stretches to fill its two-column span as a pill shape.

### Calculator Grid — 6 Rows with Distinct Heights

- Changed `grid-template-rows` from `repeat(5, 1fr)` to `repeat(4, 1fr) 0.6fr 1.5fr`:
  - Rows 1–4 (`1fr` each): standard button rows for AC/+−/%/÷, 7–9/×, 4–6/−, 1–3/+.
  - Row 5 (`0.6fr`): the "Last 5" / zero / decimal row — noticeably shorter than a standard row.
  - Row 6 (`1.5fr`): the equals (=) row — noticeably taller than a standard row.
- Updated `index.html` to move the equals button into its own row (row 6), separate from the "Last 5"/zero/decimal row (row 5). Previously all five buttons shared one row; now rows 5 and 6 are distinct.

### Preserved Features

- **Tip calculation**: bill input, 10%/20%/30% buttons, active state highlight, `—` default placeholders, auto-recalculate on input change, per-person split, clear button — all unchanged.
- **Basic calculator**: all arithmetic operations (+, −, ×, ÷), negate, percent, decimal, AC reset, divide-by-zero error handling, operator highlight — all unchanged.
- **History popup**: up to 5 most recent calculations stored in session memory, rendered in the floating overlay popup, most recent first. History persists across tab switches. Backdrop click and × button both close the popup.
- **Dark mode default**: `data-theme="dark"` on `<html>`, dark CSS tokens applied on load.
- **PWA installability**: manifest, service worker, and icons all present and correctly referenced.
- **No header**: no `<header>` element anywhere in the app.
- **Offline support**: service worker caches app shell on install and serves from cache when offline.
- **No vertical scroll**: `html, body` locked with `overflow: hidden`, all panels use `flex: 1; min-height: 0` to fit within viewport.
- **Mode toggle**: Calculator tab on left, Tip Calculator tab on right; exactly one panel visible at a time.

## Key Decisions

- **Separate equals row in HTML**: Moving the equals button to its own grid row (rather than using `grid-column: 1/-1` in a shared row) is the cleanest way to give it an independently controlled height via `grid-template-rows`, while keeping the "Last 5" row short.
- **`aspect-ratio: 1/1` on `.calc-btn`**: This is the most reliable cross-browser way to enforce circular buttons regardless of the row's `fr` height. Combined with `justify-self: center` it keeps each button centered and circular within its cell.
- **`aspect-ratio: unset` on equals and zero**: These buttons must span multiple columns and fill their cells as rectangles/pills, so the circular constraint is explicitly removed.
- **`0.6fr` for Last 5 row, `1.5fr` for equals row**: These fractional values produce a visually obvious size difference (Last 5 row is ~60% of normal, equals row is ~150% of normal) without requiring pixel-level calculations that might break on different viewport heights.
