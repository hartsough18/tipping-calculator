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

### Responsive Layout — No Horizontal Overflow on Any Viewport

#### index.html
- Removed `maximum-scale=1` and `user-scalable=no` from the viewport meta tag. The tag now reads `content="width=device-width, initial-scale=1.0"` — the clean standard form that allows the browser to scale content correctly on all devices without clamping.

#### styles.css
- Added `overflow-x: hidden` explicitly alongside the existing `overflow: hidden` on `html, body` to guarantee no horizontal bleed escapes at the root level.
- Added `width: 100%; max-width: 100vw;` to `body` so it never exceeds the viewport width.
- Added `min-width: 0` to `.container`, `.card`, `#calc-panel`, `#tip-panel`, `.tip-panel-inner`, `.input-group`, `.input-wrapper`, `.tip-buttons-group`, `.tip-buttons`, `.results`, `.result-row`, `.calc-grid`, `.calc-btn`, `.calc-display`, and `.mode-toggle-bar` — this is the key fix for flex/grid children that can otherwise overflow their parent when content is wide.
- Added `width: 100%` to `.card`, `#calc-panel`, `#tip-panel`, `.tip-panel-inner`, `.input-group`, `.input-wrapper`, `.tip-buttons-group`, `.tip-buttons`, `.results`, `.clear-btn`, `.calc-display-wrapper`, and `.calc-grid` to ensure all panel elements fill their container fluidly rather than relying solely on flex stretch.
- Added `box-sizing: border-box` explicitly to `.card`, `.mode-toggle-bar`, `.mode-tab`, `.tip-btn`, `#bill-amount`, `#num-people`, `.results`, `.clear-btn`, `.calc-display-wrapper`, `.calc-grid`, and `.calc-btn` — even though the global `*` rule already sets this, the explicit declarations make the intent clear and guard against any specificity edge cases.
- Added `min-width: 0` to `.mode-tab` and `flex: 1; min-width: 0` to `.tip-btn` so the three tip buttons and the two mode tabs shrink fluidly on narrow viewports rather than overflowing.
- Added `flex-shrink: 0` to `.result-label` and `text-align: right; min-width: 0` to `.result-value` so the results row wraps gracefully without the value label pushing outside the card.
- Added `max-width: 100%` to `.calc-display` so very long numbers wrap within the display area.

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
- **Circular calculator buttons**: `aspect-ratio: 1/1` on `.calc-btn` preserved; equals and zero override with `aspect-ratio: unset` as before.
- **6-row grid**: `grid-template-rows: repeat(4, 1fr) 0.6fr 1.5fr` preserved — short Last 5 row, tall equals row.

## Key Decisions

- **`min-width: 0` on all flex/grid children**: The single most impactful responsive fix. Flex items default to `min-width: auto`, which means they refuse to shrink below their content size. Adding `min-width: 0` allows every panel child to shrink to fit the available space, eliminating overflow on narrow viewports.
- **`overflow-x: hidden` on html and body**: Belt-and-suspenders guard. Even if some child element somehow escapes the flex containment, the root-level overflow clip prevents a horizontal scrollbar from appearing.
- **Removing `user-scalable=no` and `maximum-scale=1`**: These attributes were preventing the browser from correctly computing the initial layout width on some mobile browsers, and also harm accessibility. The clean `width=device-width, initial-scale=1.0` viewport is the correct standard form.
- **No visual changes**: All colors, spacing, typography, and interactive behaviors are byte-for-byte identical to the previous iteration. Only the overflow/sizing properties were touched.
