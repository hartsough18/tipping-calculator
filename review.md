# Tipping Calculator — Completion Report

## What Was Built

A fully functional single-screen tipping calculator static web app. The app runs by opening `index.html` directly in any browser (`file://` — no web server required). It works entirely offline with no external dependencies.

## How to Open

Open `index.html` in any modern web browser. No server, no build step, no npm install required.

## Files

| File | Role |
|------|------|
| `index.html` | Entry page — full markup for the single-screen calculator UI |
| `styles.css` | Complete stylesheet — dark/light theme tokens, full-screen layout, large thumb-friendly buttons |
| `app.js` | All application logic — tip calculation, validation, DOM updates |
| `pwa_manifest.json` | Web App Manifest for PWA home-screen install |
| `sw.js` | Service worker — caches app shell on install, serves from cache offline |
| `icon-192.png` | PWA icon (192×192) |
| `icon-512.png` | PWA icon (512×512) |
| `manifest.json` | Build manifest listing all files |
| `review.md` | This completion report |

## Changes Made in This Iteration

### Removed Header and Navigation
- The `<header>` element and its `<h1>` title were removed entirely from `index.html`.
- The `top-nav` div and History button were removed — no navigation elements remain.
- The history view panel was removed — the app is now a single screen only.
- All header, history, and navigation CSS rules were removed from `styles.css`.
- History logic (array, rendering, view-switching) was removed from `app.js`.

### Full-Screen Layout
- The card now uses `min-height: 100vh` and `flex: 1` to fill the entire viewport height.
- Body padding removed; container stretches to full height.
- `max-width` set to 480px for a wider feel on larger phones.

### Larger, Thumb-Friendly Buttons
- Tip buttons: `padding` increased to `26px 8px`, `font-size` to `1.5rem`, `font-weight` to `800`, `min-height` set to `80px`.
- Bill input: `font-size` increased to `2rem`, `padding` increased to `20px`.
- Result values: `font-size` increased to `2rem`, `font-weight` to `800`, row padding increased to `26px 28px`.
- Border radius increased on card elements for a more modern feel.

### Fixed Zero Bill Handling
- `app.js` previously rejected `bill <= 0` (showing `—` for zero). Updated to reject only `bill < 0`, so a bill of `$0.00` correctly displays `$0.00` tip and `$0.00` total, satisfying Preserved criterion 11.

### Dark Mode Default
- `data-theme="dark"` on `<html>` ensures dark mode loads immediately with no flash.
- CSS custom properties on `:root` define light-mode tokens; `[data-theme="dark"]` overrides them with dark-mode values.

## Key Decisions

- **Single screen only**: No history, no navigation, no multi-view behavior. The app opens directly to the calculator.
- **Zero bill shows `$0.00`**: A bill of zero produces tip = 0 and total = 0. The JS guard now uses `bill < 0` (not `bill <= 0`) so zero is treated as valid arithmetic, satisfying the acceptance criterion that explicitly requires `$0.00` display for a zero bill.
- **Full-height card**: Using `min-height: 100vh` on the card and `flex: 1` on the container ensures the calculator fills the screen on all device sizes.
- **Dark mode default**: `data-theme="dark"` on `<html>` ensures dark mode loads immediately with no flash of light mode.
- **Vanilla JS only**: No framework, no bundler, no CDN. Classic `<script src="app.js">` tag for `file://` compatibility.
- **`toFixed(2)` on all outputs**: Prevents floating-point display artifacts. Output strings are never re-parsed after formatting.
