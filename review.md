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

### Tip Panel — Intrinsic Content Height, Vertically Centered

#### styles.css

**Root cause of the stretch:** The `.card` element used `flex: 1` which caused it to grow to fill the full available height of the `.container` regardless of which panel was active. When the tip panel was shown, the card (and thus the tip panel) stretched to fill the entire viewport height, distorting proportions and making tip buttons appear oval/elongated.

**Fix — `.card.tip-mode` modifier class:**
- Added `.card.tip-mode` rule: `flex: 0 0 auto; height: auto; overflow: visible`. When the tip panel is active, the card no longer grows to fill available height — it sizes to its intrinsic content.
- Changed `.container` to use `justify-content: center` so the card is vertically centered in the available space when it doesn't fill the full height (tip mode).
- The default `.card` retains `flex: 1` for calc mode, where the button grid needs to fill the available height.

**Tip buttons — enforced circular shape:**
- Changed `.tip-btn` to use `aspect-ratio: 1 / 1`, `padding: 0`, `border-radius: 50%`, and `display: flex; align-items: center; justify-content: center`. This guarantees the buttons are always circular (width = height) regardless of viewport size.
- Removed the old `padding: 14px 8px` which could cause oval shapes on some viewports.

**`#tip-panel` and `.tip-panel-inner`:**
- Changed `#tip-panel` from `flex: 1` to `flex: 0 0 auto` so it does not stretch within the card.
- Removed `flex: 1` and `min-height: 0` from `.tip-panel-inner` — it now sizes to content naturally.

#### app.js

**Mode toggle — `tip-mode` class toggling:**
- In `tabCalc` click handler: added `card.classList.remove('tip-mode')` to restore calc mode sizing.
- In `tabTip` click handler: added `card.classList.add('tip-mode')` to switch to intrinsic-height tip mode.

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
- **6-row grid**: `grid-template-rows: repeat(4, 1fr) 0.6fr 1.5fr` preserved — short Last 5 row, tall equals row.
- **No horizontal overflow**: all `min-width: 0`, `width: 100%`, and `overflow-x: hidden` rules preserved.
