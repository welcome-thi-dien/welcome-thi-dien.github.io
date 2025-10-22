### Repo overview

- This is a small static website that renders an interactive Three.js "galaxy" scene. Key files:
  - `index.html` — app shell, importmap for Three.js, global data injection (`window.dataLove2Loveloom`), and light UI elements.
  - `script.js` — main app logic (Three.js scene, shaders, Points, texture creation, event handling). Large single-file implementation.
  - `style.css` — page styling and responsive hints.
  - `image/`, `img/` — image assets used as textures for heart-shaped point groups.
  - `music.mp3` — optional background audio controlled by `index.html` music manager.

### Big-picture architecture (what to know quickly)

- Single-page, static static-site. No bundler or package.json. Modules are loaded with an importmap in `index.html` that points to CDN versions of three.js (e.g., `three@0.152.2`).
- The rendering code is contained in `script.js`. It creates a THREE.Scene with: fog, a central glow sprite, nebula sprites, a global galaxy Points cloud, and multiple Points groups (one per image in `heartImages`).
- Asset-driven behaviour: `script.js` reads `window.dataLove2Loveloom.data` (if present) to extend `heartImages` or other runtime data. Inject data by setting `window.dataLove2Loveloom` in `index.html` or a small script before the module import.

### Developer workflows & helpful commands

- Run locally: open `index.html` in a modern browser (file:// will often work because the project uses relative image paths and importmap CDNs). If CORS hits occur for textures, run a simple HTTP server in the repo root, for example (macOS zsh):

```bash
# from /Users/duymanh/Documents/Code/Diennn
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

- Debugging graphics: use Chrome/Edge/Firefox with DevTools. Useful places to inspect:
  - Console logs from `script.js` (it prints group/image counts).
  - Breakpoints inside `script.js` near the `img.onload` handler and shader uniforms (`uRippleTime`, `uTime`).

### Project-specific conventions & patterns

- No build step—code runs as-is in browser modules. Keep ES module imports and importmap URLs in sync with the versions used in `index.html`.
- Data injection: the project expects optional runtime overrides in `window.dataLove2Loveloom`. Example in `index.html` shows `template` and `data.keychain` / `data.ringTexts` keys. Use this exact shape when adding runtime data.
- Asset paths: images are referenced as relative paths like `./image/IMG_0549.JPG`. When adding images, keep them in `image/` and use the same relative patterns.

### Integration points & external dependencies

- three.js (via CDN importmap). The code uses examples loaders and controls via importmap aliases: `OrbitControls.js`, `FontLoader.js`, `TextGeometry.js`.
- No server-side APIs or build-time dependency management are present. Any external data must be injected at runtime via `window.dataLove2Loveloom` or by editing `index.html`.

### What AI agents should do first (short checklist)

1. Read `index.html` and `script.js` top-to-bottom. Focus on:
   - the importmap (module versions),
   - `window.dataLove2Loveloom` usage,
   - `heartImages` array and image loading flow.
2. When changing visuals, prefer local edits to `script.js` and verify in the browser using the local http server.
3. When adding new assets, put them in `image/` and reference them in `heartImages` or `window.dataLove2Loveloom.data.heartImages`.

### Examples to reference in PRs or patches

- To add a new heart image, upload `image/IMG_new.jpg` and append `./image/IMG_new.jpg` to the `heartImages` array in `script.js`, or inject it via `window.dataLove2Loveloom.data.heartImages` before `script.js` loads.
- To change galaxy density, edit the `galaxyParameters.count` and the `maxDensity` / `minDensity` heuristics in `script.js`.

### Constraints & gotchas discovered from code

- Large `script.js` (single file ~1.4k lines) — make minimal, localized changes to avoid regressions.
- Some image files use HEIC; browsers may not load HEIC locally—prefer JPEG/PNG for cross-browser compatibility.
- The project relies on Canvas textures created at runtime — CORS-blocked images will break texture creation when loaded from remote origins.

If anything here is unclear or you'd like the instructions expanded (for example, add testing, a local dev server task, or split `script.js` into modules), tell me which area to expand and I'll iterate.
