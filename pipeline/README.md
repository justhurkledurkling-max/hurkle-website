# Photo → coloring page pipeline

Turns reference photos into print-ready coloring page PDFs using Photoshop and Illustrator.
For fully hand-drawn work (Fresco, or vector SVGs authored directly), skip to step 2.

```
pipeline/
  incoming/   <- drop raw reference photos here (gitignored — never commit source photos)
  lineart/    <- Photoshop's output lands here (gitignored, intermediate only)
```

## Step 1 — Photo to line art (Photoshop)
1. Drop photos into `pipeline/incoming/` (jpg/png/tif).
2. In Photoshop: **File → Scripts → Browse...** → select `scripts/photoshop_photo_to_lineart.jsx`.
3. It batch-converts every photo and writes `<name>-lineart.png` into `pipeline/lineart/`.
4. **Test on one photo first.** Open `scripts/photoshop_photo_to_lineart.jsx` in a text editor and tune:
   - `BLUR_RADIUS` (default 6) — higher = softer/thicker lines
   - `THRESHOLD_LEVEL` (default 128) — lower = more black retained
   These vary a lot by photo (busy vs. simple, high vs. low contrast) — there's no universal setting.

**Skipping Photoshop**: drawn something directly in Fresco or elsewhere? Export a PNG and drop it straight into
`pipeline/lineart/` — step 2 doesn't care where the image came from.

## Step 2 — Finalize and export (Illustrator)
1. In Illustrator: **File → Scripts → Browse...** → select `scripts/illustrator_finalize_page.jsx`.
2. When prompted, enter the product slug (e.g. `garden-folk-coloring-set`) — this must match (or will create)
   `products/<slug>/`.
3. It places each image in `pipeline/lineart/` onto a branded US Letter page (frame + title pulled from the
   filename) and exports a print-ready PDF into `products/<slug>/pdf/`.
4. Once you've confirmed the output looks right, delete the files out of `pipeline/lineart/` (and `incoming/`) —
   they're scratch space, not meant to accumulate.

## Then
Fill out `products/<slug>/listing.md` from `docs/etsy-listing-template.md` and upload the PDF(s) to the Etsy
listing. See `products/README.md` for the full product folder convention.

## Notes
- Titles are auto-generated from filenames: `01-mushroom-cottage.jpg` → "Mushroom Cottage". Name source photos
  accordingly before running step 1.
- Both scripts assume they're run from inside this repo (they resolve `pipeline/` and `products/` relative to
  their own location) — don't move them out of `scripts/`.
- Neither script has been run end-to-end yet since there's no Photoshop/Illustrator access from this session —
  treat the first real run as a test, not a production batch.
