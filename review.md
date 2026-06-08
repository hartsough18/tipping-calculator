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
| `app.js` | All application logic — tip calculation, split bill, basic calculator, mode toggle, history |
| `pwa_manifest.json` | Web App Manifest for PWA home-screen install |
| `sw.js` | Service worker — caches app shell on install, serves from cache offline |
| `icon-192.png` | PWA icon (192×192) |
| `icon-512.png` | PWA icon (512×512) |
| `manifest.json` | Build manifest listing all files |
| `review.md` | This completion report |

## Changes Made in This Iteration

### Default View: Standard Calculator
- The standard calculator panel is the active default on page load.
- In `index.html`, the `active` class is on `tab-calc` and the `hidden` class is on `tip-panel`.

### Header Removed
- No `<header>` element exists. The mode toggle tab bar serves as the only mode label.

### Calculator Buttons Enlarged
- `.calc-btn` height: 78px, font-size: 1.45rem.
- `.calc-equals` font-size: 1.65rem.
- `.calc-display` font-size: 2.75rem.

### Last 5 History Feature Added
- A "Last 5" button was added to the calculator grid (bottom-left position, before the zero button).
- Tapping "Last 5" toggles a history panel visible above the button grid.
- The history panel lists up to 5 most recent completed calculations (expression + result), most recent first.
- When no calculations have been made, the panel shows "No calculations yet".
- When a new calculation completes (via `=`), the history array is updated and the panel re-renders if visible.
- History persists when switching between tip calculator and basic calculator tabs.
- The "Last 5" button highlights (primary color) when the history panel is open.
- No history UI exists in the tip calculator panel.

### Dark Mode (Default) — Preserved
- `data-theme="dark"` on the `<html>` element.

### Number of People / Per-Person Split — Preserved
- "Number of People" input and "Per Person" output row remain fully functional.

### Clear Button — Preserved
- Resets bill, people, active tip button, and all outputs.

### Mode Toggle — Preserved
- Two-tab toggle bar ("Tip Calculator" / "Calculator") at the top of the card.

### Basic Calculator — Preserved
- All arithmetic operations, state machine, divide-by-zero error handling, and AC reset remain unchanged.

## Key Decisions

- **History stored in JS array (not localStorage)**: History is session-only — it resets on page reload. This keeps the implementation simple and avoids persistence complexity.
- **History capped at 5 entries**: The array is sliced to 5 after each push. The oldest entry is dropped when a 6th is added.
- **History panel renders on demand**: `renderHistory()` is called when the panel is toggled open or when a new calculation completes while the panel is already visible. This avoids unnecessary DOM updates.
- **Expression captured at `=` time**: The expression string (e.g. "50 + 25") is assembled from `expressionFirst`, `expressionOp`, and the second operand at the moment `=` is pressed, giving a clean human-readable history entry.
- **"Last 5" button in the calc grid**: Placed in the bottom-left cell (where the zero button previously spanned), with the zero button now spanning only 2 columns. This keeps the grid layout intact without adding an extra row.
- **Vanilla JS only**: No framework, no bundler, no CDN. Classic `<script src="app.js">` tag for `file://` compatibility.
