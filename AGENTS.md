# Agent Instructions

## Scope
This repo hosts a simple GitHub Pages site to celebrate a birthday. Keep the experience lightweight and static (HTML/CSS/JS only). No build tools required.

## Quick Start
- Entry point: `index.html` uses `style.css` and `app.js` only.
- Serve locally with any static server (e.g., `python -m http.server 8080`).
- All external assets (fonts, images, demo video/PDF) load via HTTPS URLs to keep the repo small.

## Editing Guidelines
- Preserve the clean separation of concerns: structure in `index.html`, styling in `style.css`, behavior in `app.js`.
- Keep code accessible: meaningful `alt`, `aria-label`, keyboard support for the slider.
- Prefer remote media links over large binaries committed to the repo. If adding local assets, place them under `assets/` and optimize them first.
- Typography intentionally uses Playfair Display + Work Sans; keep or replace with equally purposeful pairs, not system defaults.
- Colors are defined as CSS custom properties in `:root`; tweak there instead of hard-coding.

## Media Update Cheatsheet
- Local folders: add your files under `assets/video/` and `assets/pdf/` (placeholder `.gitkeep` exists so folders stay in git).
- Video: change the `<source>` in `#video video` to your file, e.g. `assets/video/birthday.mp4`, and adjust `poster` if desired.
- PDF: update the `src` of the `<iframe>` in the `#pdf` section to your file, e.g. `assets/pdf/letter.pdf`.
- Slider images: edit the `slides` array in `app.js` to point to your own image URLs. The dots auto-render; no HTML changes needed.

## Testing
- Manual: verify video playback, PDF embed, and slider buttons/arrow keys on desktop and mobile widths.
- Automated: none required; if you add tests, remove temporary scripts before committing.

## Deployment
- Designed for GitHub Pages on the main branch root. No build step needed.
- After pushing, wait for GitHub Pages to refresh (usually under 1 minute).

## Safety
- Do not commit secrets. All media links should be public.
- Keep files ASCII to avoid encoding issues.
