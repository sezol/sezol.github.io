# Sejal's portfolio — starter site

Plain HTML + CSS + JavaScript. No build step, no framework — open `index.html`
in a browser and it just works.

## File map
- `index.html` — all the content and page structure
- `style.css` — colors, fonts, layout (Palette C: pine / eucalyptus / dusty rose)
- `script.js` — the click-to-smile bobblehead interaction, plus a small nav highlight
- `art-brief.md` — hand this to your friend when they start the real bobblehead drawing

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
2. Push these three files (plus your final bobblehead art, once you have it)
   to the repo:
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
The bobblehead idea is on hold — right now the hero just shows a simple
placeholder: a monogram circle that floats gently and pulses on click.
It's intentionally basic. When you land on your bigger animation idea,
open `index.html` and replace everything inside `<div id="hero-visual">`,
then rebuild the `playHeroAnimation()` function in `script.js` (it's
clearly marked with a `HERO VISUAL INTERACTION` comment) — the click
listener around it doesn't need to change.

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
