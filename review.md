# Tipping Calculator — Completion Report

## What Was Built

A fully functional tipping calculator and basic arithmetic calculator static web app. The app runs by opening `index.html` directly in any browser (`file://` — no web server required). It works entirely offline with no external dependencies.

## How to Open

Open `index.html` in any modern web browser. No server, no build step, no npm install required.

## Files

| File | Role |
|------|------|
| `index.html` | Entry page — full markup for both calculator panels |
| `styles.css` | Complete stylesheet — dark/light theme tokens, layout, responsive design |
| `app.js` | All application logic — tip calculation, split bill, basic calculator, mode toggle |
| `pwa_manifest.json` | Web App Manifest for PWA home-screen install |
| `sw.js` | Service worker — caches app shell on install, serves from cache offline |
| `icon-192.png` | PWA icon (192×192) |
| `icon-512.png` | PWA icon (512×512) |
| `manifest.json` | Build manifest listing all files |
| `review.md` | This completion report |

## Changes Made in This Iteration

### Default View: Standard Calculator
- The standard calculator panel is now the active default on page load — no click required.
- In `index.html`, the `active` class was moved from `tab-tip` to `tab-calc`, and the `hidden` class was moved from `calc-panel` to `tip-panel`.
- In `app.js`, the mode toggle initialization was updated to reflect the calculator-first default (no `appTitle` element exists; the tab bar itself serves as the mode label).

### Header Removed
- The `<header>` element and its `<h1>` were removed entirely from `index.html`.
- All `header` and `header h1` CSS rules were removed from `styles.css`.
- The `appTitle` JS reference was removed from `app.js` since no header element exists.
- Top padding on `body` was reduced from `24px` to `16px` to compensate for the removed header.

### Calculator Buttons Enlarged
- `.calc-btn` height increased from `68px` to `78px`.
- `.calc-btn` font-size increased from `1.25rem` to `1.45rem`.
- `.calc-equals` font-size increased from `1.5rem` to `1.65rem`.
- `.calc-display` font-size increased from `2.5rem` to `2.75rem`.
- `.calc-display-wrapper` min-height increased from `80px` to `88px`.
- `.calc-zero` border-radius and padding-left adjusted to match the larger button size.
- Responsive breakpoint (`max-width: 360px`) updated: `.calc-btn` height `66px`, font-size `1.25rem`; `.calc-display` font-size `2.25rem`.

### Dark Mode (Default) — Preserved
- `data-theme="dark"` remains on the `<html>` element.
- All dark mode CSS custom property overrides remain intact.

### Number of People / Per-Person Split — Preserved
- "Number of People" input and "Per Person" output row remain fully functional.

### Clear Button — Preserved
- Clear button resets bill, people, active tip button, and all outputs.

### Mode Toggle — Preserved
- Two-tab toggle bar ("Tip Calculator" / "Calculator") remains at the top of the card.
- Clicking a tab shows the corresponding panel and hides the other.

### Basic Calculator — Preserved
- All arithmetic operations, state machine, divide-by-zero error handling, and AC reset remain unchanged.

## Key Decisions

- **Calculator-first default**: The standard calculator is the primary use case for quick arithmetic; the tip calculator is a secondary tool. Defaulting to the calculator reduces taps for the most common workflow.
- **No header**: The mode toggle tab bar ("Tip Calculator" / "Calculator") provides sufficient context for which mode is active. A separate header title was redundant and consumed vertical space on small screens.
- **Larger calc buttons**: Increased height (68→78px) and font size (1.25→1.45rem) improve tap target size and readability on mobile, reducing mis-taps on the 4-column grid.
- **Vanilla JS only**: No framework, no bundler, no CDN. Classic `<script src="app.js">` tag for `file://` compatibility.
