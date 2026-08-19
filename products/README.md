# Product pipeline

Every product (a coloring page set, puzzle pack, etc.) gets its own folder here:

```
products/
  <product-slug>/
    svg/          source line-art, one file per page, viewBox="0 0 850 1100" (Letter @ 100dpi)
    pdf/          print-ready output, don't hand-edit
    listing.md    Etsy listing copy — fill in from docs/etsy-listing-template.md
```

There are two ways to produce the PDFs in `pdf/`, depending on where the art comes from:

## A — Hand-drawn vector art (SVG)
1. Drop finished SVG pages into `<product-slug>/svg/`.
2. Run:
   ```
   python3 scripts/svg_to_pdf.py products/<product-slug>/svg products/<product-slug>/pdf
   ```

## B — Photos or Fresco/Photoshop art (Adobe pipeline)
Full walkthrough: `pipeline/README.md`. Short version: drop photos in `pipeline/incoming/`, run
`scripts/photoshop_photo_to_lineart.jsx` in Photoshop, then `scripts/illustrator_finalize_page.jsx` in
Illustrator — it exports directly into `products/<product-slug>/pdf/`. Fresco or other hand-drawn exports can
skip straight to the Illustrator step by dropping a PNG into `pipeline/lineart/`.

## Then, either way
3. Fill out `<product-slug>/listing.md` using `docs/etsy-listing-template.md`.
4. Upload the PDF(s) as digital files on the Etsy listing; use one page (or a mockup) as the listing's cover image.

## Naming convention
`<product-slug>` = lowercase, hyphenated, matches the Etsy listing title (e.g. `garden-folk-coloring-set`).
Page files: `01-mushroom-cottage.svg`, `02-snail-mail.svg`, etc. — numeric prefix controls PDF page order.
