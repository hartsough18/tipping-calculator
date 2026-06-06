# AGENTS.md — tipping_calculator builder (static web app)

## Your role
You are an autonomous code builder. You write the website's files DIRECTLY to disk in `/opt/ambient/projects/tipping_calculator` using your own file-editing tools, fully implemented, finishing the entire build yourself in this one session. There is NO human to hand off to and NO follow-up turn — when you stop, whatever is on disk is final.

## What to build — a STATIC web app
Plain HTML + CSS + vanilla JavaScript that runs by simply opening `index.html` in a browser (a `file://` open — there is NO web server). It must work fully offline.

## FORBIDDEN — these cause an automatic FAIL
- NO build step / bundler / framework: no React, Vue, Svelte, Next, Vite, webpack, npm, or `package.json`. Vanilla JS only.
- NO network dependencies: do not load frameworks or fonts from a CDN, do not `fetch()` remote data. Everything needed must be in the files on disk so it works offline.
- NO ES modules: include scripts with a CLASSIC `<script src="app.js"></script>` tag, NOT `<script type="module">` and NOT `import`/`export` — ES modules fail under `file://` due to CORS, so the page would silently break when opened directly.
- Do NOT write a meta-script that generates the files; write the real files directly.
- Do NOT narrate or hand off to a human ("save this as…", "now run…"). You build it.
- Do NOT emit the code as chat/markdown instead of writing files.
- Do NOT leave stubs: no `// TODO`, no `FIXME`, no empty function bodies, no placeholder text like 'Lorem ipsum' standing in for real content the plan calls for.

## Every file must be REAL
- `index.html`: the real structure for every screen/state the plan describes, wired to the CSS and JS. Reference `styles.css` and `app.js` by relative path.
- `styles.css`: real styling — layout, colors, typography — not an empty shell.
- `app.js`: the real app logic AND all the data the plan calls for (e.g. every question, every result/flavor + its text). No 'add more here' placeholders — author the full set.

## PWA (phone home-screen install) — REQUIRED for this build
This app will be installed on a phone home screen, so it must include:
- `pwa_manifest.json` — the Web App Manifest (NOT the build manifest.json):
  `{"name": "App Name", "short_name": "Name", "start_url": ".", "display": "standalone", "background_color": "#ffffff", "theme_color": "#000000", "icons": [{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png"}]}`
- `sw.js` — a minimal service worker for offline support:
  Cache app shell on install; serve from cache when offline. Keep it simple.
- `icon-192.png` and `icon-512.png` — simple solid-color PNG icons are fine; generate them as data URIs or use a simple Canvas-based icon generator in sw.js.
- `index.html` must include in `<head>`:
  `<link rel="manifest" href="pwa_manifest.json">`
  `<meta name="mobile-web-app-capable" content="yes">`
  `<meta name="apple-mobile-web-app-capable" content="yes">`
  `<meta name="apple-mobile-web-app-status-bar-style" content="default">`
  And at the end of `<body>`: `<script>if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');</script>`

## Finish sequence (do ALL of these before you stop)
1. Write `index.html`, `styles.css`, `app.js` (and any extra data/asset files) to `/opt/ambient/projects/tipping_calculator`, fully implemented.
   Also write `pwa_manifest.json` and `sw.js` for the PWA install.
2. Write `/opt/ambient/projects/tipping_calculator/manifest.json` — REQUIRED, LAST. Format: `{"files": [{"path": "index.html", "role": "entry page"}, ...]}`. List EVERY file you created, paths relative to the workdir.
3. `git -C /opt/ambient/projects/tipping_calculator add -A && git -C /opt/ambient/projects/tipping_calculator commit -m 'Initial build: tipping_calculator'`
4. Write `/opt/ambient/projects/tipping_calculator/review.md` as a past-tense COMPLETION REPORT (what you built, the file list, key decisions). A report, NOT instructions to a human.

## The build gate (automatic, free if you pass)
A static gate then checks: (a) `index.html` exists, (b) manifest.json parses and lists files, (c) every declared file exists on disk and is non-trivial, (d) index.html references your CSS/JS, (e) no `// TODO`/`FIXME` stubs. Fail and you get the exact issues back to fix. Write real, complete code the first time.

## Workspace
Working directory: `/opt/ambient/projects/tipping_calculator` — full read/write access here.
