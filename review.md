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

### Calculator Grid — Equal-Height Digit Rows + Taller Equals Row

#### styles.css

**Root cause of unequal row heights:** The previous grid used `grid-template-rows: repeat(4, 1fr) 0.6fr 1.5fr`. The fifth row (containing Last 5, 0, and decimal) was `0.6fr` — noticeably shorter than the four `1fr` digit rows above it. This violated the acceptance criteria requiring all four digit rows (including the 0 row) to appear at equal height.

**Fix — updated `grid-template-rows`:**
- Changed to `grid-template-rows: repeat(5, 1fr) 1.5fr`.
- All five button rows (AC row, 7-8-9, 4-5-6, 1-2-3, and the Last5/0/decimal row) now share the same `1fr` height — they are visually equal.
- The equals row remains `1.5fr`, making it noticeably taller than any standard digit row and consuming all remaining vertical space.

**"Last 5" button visual appearance (criterion 19):**
- The "Last 5" button cell is now `1fr` (same as digit rows), but the button itself is constrained to `max-width: 60%; max-height: 60%` of its cell. This makes the button visually appear noticeably smaller/shorter than the surrounding digit buttons, satisfying the requirement that the "Last 5" button row appears shorter without making the grid row itself shorter.
- Font size reduced to `0.72rem` (from `0.85rem`) to fit the smaller button footprint.

**Comment updated** in `.calc-grid` to accurately describe the new 6-row layout.

### Preserved Features

- **Tip calculation**: bill input, 10%/20%/30% buttons, active state highlight, `—` default placeholders, auto-recalculate on input change, per-person split, clear button — all unchanged.
- **Basic calculator**: all arithmetic operations (+, −, ×, ÷), negate, percent, decimal, AC reset, divide-by-zero error handling, operator highlight — all unchanged.
- **History popup**: up to 5 most recent calculations stored in session memory, rendered in the floating overlay popup, most recent first. History persists across tab switches. Backdrop click and × button both close the popup.
- **Dark mode default**: `data-theme="dark"` on `<html>`, dark CSS tokens applied on load.
- **PWA installability**: manifest, service worker, and icons all present and correctly referenced.
- **No header**: no `<header>` element anywhere in the app.
- **Offline support**: service worker caches app shell on install and serves from cache when offline.
- **No vertical scroll**: `html, body` locked with `overflow: hidden`, calc panel uses `flex: 1; min-height: 0` to fit within viewport.
- **Mode toggle**: Calculator tab on left, Tip Calculator tab on right; exactly one panel visible at a time.
- **Circular calculator buttons**: `aspect-ratio: 1/1` on `.calc-btn` preserved; equals and zero override with `aspect-ratio: unset` as before.
- **Equals button full-width**: `grid-column: 1 / -1`, `aspect-ratio: unset`, `border-radius: 39px` — wide rectangular pill, not circular.
- **No horizontal overflow**: all `min-width: 0`, `width: 100%`, and `overflow-x: hidden` rules preserved.
- **Tip mode card sizing**: `.card.tip-mode` with `flex: 0 0 auto` preserved so tip panel sizes to intrinsic content height.
