# Sejal's portfolio — black and green

Plain HTML + CSS + JavaScript. No build step, no framework — open `index.html`
in a browser and it just works.

## File map
- `index.html` — homepage: hero, about, experience, projects, publications teaser, contact
- `publications.html` — dedicated page with full write-ups and an interactive demo for each paper
- `images/` — your cut-out photo (`sejal.png`) and the two green flower images used between sections
- `resume.pdf` — linked from the "Download resume" button
- `src/` — **readable, commented source** for `style.css`, `script.js`, `publications.js` — edit files here
- `style.css`, `script.js`, `publications.js` (in the root) — **minified** versions generated from `src/`; these are what actually get deployed and linked from the HTML
- `build.sh` / `package.json` — regenerates the minified files from `src/`

## Editing the site's styling or behavior
Always edit the files inside `src/`, never the minified ones in the root —
your edits to the minified files would just get overwritten next time you
run the build.

One-time setup (only needed once per computer):
```
npm install
```

After any edit inside `src/`:
```
npm run build
```
This regenerates `style.css`, `script.js`, and `publications.js` from your
`src/` changes. Then commit and push as usual — commit both the `src/`
change and the regenerated files together.

Editing `index.html` and `publications.html` directly is fine — HTML isn't
minified, since minifying it barely helps and it'd make editing much more
annoying.

## Adding a new page later
Any new page should keep the same `<link rel="stylesheet" href="style.css">`
and copy the `<header class="nav">` block from `index.html` so the look stays
consistent. Just adjust the nav links: from a page other than the homepage,
links to homepage sections need `index.html#section-id` instead of
`#section-id`, exactly like `publications.html` does.

## Preview it locally
Just double-click `index.html`, or in a terminal:
```
cd portfolio
python3 -m http.server 8000
```
then open `http://localhost:8000` in your browser.

## Deploy for free with GitHub Pages
1. Create a new repo on GitHub. If you name it exactly `sezol.github.io`, your
   site will live at that URL automatically. Any other name also works — it'll
   just live at `sezol.github.io/repo-name`.
2. Push everything in this folder (including `images/`) to the repo:
   ```
   git init
   git add .
   git commit -m "First version of my portfolio"
   git branch -M main
   git remote add origin https://github.com/sezol/YOUR-REPO-NAME.git
   git push -u origin main
   ```
3. On GitHub: go to the repo's **Settings → Pages**, set the source branch to
   `main` and folder to `/ (root)`, save.
4. Wait a minute or two — your live URL shows up on that same Pages settings
   screen.
5. Any time you want to update the site, edit your files, commit, and
   `git push` again. GitHub Pages redeploys automatically.

## The hero visual
The hero now shows your actual photo (`profile.jpg`, pulled from your resume
headshot) inside a circle that floats gently and pulses on click. To swap in
a different photo later, just replace `profile.jpg` with a new image using
the same filename — a square image works best since it's center-cropped into
a circle automatically. When you land on a bigger animation idea, open
`index.html` and rework what's inside `<div id="hero-visual">`, then rebuild
the `playHeroAnimation()` function in `script.js` (marked with a
`HERO VISUAL INTERACTION` comment) — the click listener around it doesn't
need to change.

## Updating your resume
The "Download resume" button always points to a file named `resume.pdf` in the
same folder as `index.html` — the code never references a specific version.
To update it later:
1. Export/save your new resume as a PDF.
2. Rename it exactly `resume.pdf` (replacing the old one).
3. Commit and push — no HTML or CSS changes needed.

## Updating content later
Everything in Experience, Projects, and Publications is plain HTML in
`index.html` — copy an existing `<div class="card">` or `<li>` block and edit
the text to add a new one.

## Privacy notes
- The GitHub repo is private, so casual visitors can't browse your commit
  history or file list on github.com. GitHub Pages still serves the live
  site publicly either way — that's normal and unavoidable for any website.
- `style.css`, `script.js`, and `publications.js` are minified before
  deploy, so "View Page Source" on the live site shows compressed code
  instead of clean, commented source. This discourages casual copying but
  doesn't make the code impossible to read — nothing can, since browsers
  need the actual code to run the page.

## Debugging habits (the "how do I fix this" toolkit)
- **Right-click → Inspect** (or F12) on the live page opens DevTools.
- **Console tab**: red text = a JavaScript error, with a clickable line
  number showing exactly where it broke.
- **Elements tab**: click the arrow-cursor icon, then click anything on the
  page to see its exact HTML and CSS — you can edit values live to test a
  fix before touching the real file.
- **Made a change but the site looks the same?** That's usually the browser
  cache. Hard-refresh with `Ctrl+Shift+R` (`Cmd+Shift+R` on Mac).
- **Network tab**: shows every file the page tried to load; a red/404 row
  means a filename or path is wrong somewhere in `index.html`.
- **Mobile view**: the phone/tablet icon in DevTools simulates different
  screen sizes so you can catch layout issues without a second device.


## How the scrolling works
`src/script.js` watches how far you've scrolled and writes small numbers (0 to 1)
onto elements as CSS variables (`--hp`, `--lit`, `--rp`, `--dp`). The CSS in
the "SCROLL EFFECTS" block of `src/style.css` turns those numbers into movement.
With reduced-motion turned on, or no JavaScript, everything just shows in its
finished position.

## Colours (each has one job)
Base `#0a0a0a`, text `#f4f4f0`, accent green `#34d97b` (where to look or click).
Change them once in the `:root` block at the top of `src/style.css`.
