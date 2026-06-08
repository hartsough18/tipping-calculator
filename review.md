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

### Dark Mode (Default)
- Added `data-theme="dark"` to the `<html>` element so the app loads in dark mode immediately.
- Added a full set of `[data-theme="dark"]` CSS custom property overrides: dark background (`#0f172a`), dark card surface (`#1e293b`), light text (`#f1f5f9`), muted borders, and dark-appropriate button surfaces for all elements in both panels.

### Number of People / Per-Person Split
- Added a "Number of People" `<input type="number">` (default `1`, min `1`, step `1`) below the tip buttons.
- Added a "Per Person" output row in the results panel below "New Total".
- Per-person logic validates that the people value is a positive integer ≥ 1 (using `Number.isInteger` and `>= 1` checks); zero, negatives, non-integers, and empty values all show `—` for Per Person while Tip Amount and New Total remain displayed if bill and tip are valid.
- Per-person recalculates instantly on any change to bill input, tip button, or people input.

### Clear Button
- Added a "Clear" button below the results panel.
- Clicking Clear empties the bill input, resets people to `1`, removes the active class from all tip buttons, and resets all three output fields to `—`.

### Mode Toggle
- Added a two-tab toggle bar ("Tip Calculator" / "Calculator") at the top of the card.
- Clicking a tab shows the corresponding panel and hides the other; the active tab is highlighted.
- The page `<h1>` title updates to match the current mode.

### Basic Calculator
- Added a full basic calculator panel with: display area, digit buttons 0–9, decimal point, operators (÷ × − +), AC (all-clear), and = (equals).
- State machine tracks `firstOperand`, `operator`, `waitingForSecond`, and `justEvaluated` flags.
- All four arithmetic operations implemented manually via a `switch` statement — no `eval()`.
- Divide-by-zero shows "Error"; AC clears the error and resets to `0`.
- Only one decimal point allowed per number entry.
- Active operator button highlighted while waiting for second operand.
- Zero button spans two columns (standard calculator layout).

### Bug Fixes
- Fixed: bill amount of `0` now correctly shows `—` (previously showed `$0.00`). The validation now uses `bill <= 0` to reject zero and negatives, consistent with the `min="0.01"` HTML attribute.
- Fixed: clearing the bill input while a tip button is active now correctly shows `—` for all outputs (previously could show `$0.00`).

## Key Decisions

- **Dark mode via `data-theme` attribute on `<html>`**: Allows CSS custom properties to cascade to all elements without JavaScript on load. The attribute is set in HTML so dark mode is immediate — no flash of light mode.
- **CSS custom properties for theming**: All color values are tokens; both panels inherit dark mode automatically with no per-element overrides needed.
- **Per-person validation uses `Number.isInteger`**: Explicitly rejects `1.5`, `0`, negatives, and empty — no silent fallback to `1`.
- **Basic calculator uses explicit state machine**: No `eval()`, no `Function()`. Arithmetic is a plain `switch` on the stored operator string.
- **Mode toggle is a tab bar, not a hidden checkbox**: Cleaner semantics, accessible, works without JS tricks.
- **Vanilla JS only**: No framework, no bundler, no CDN. Classic `<script src="app.js">` tag for `file://` compatibility.
