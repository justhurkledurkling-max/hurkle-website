# Product pipeline

Every product (a coloring page set, puzzle pack, etc.) gets its own folder here:

```
products/
  <product-slug>/
    svg/          source line-art, one file per page, viewBox="0 0 850 1100" (Letter @ 100dpi)
    pdf/          print-ready output — generate with scripts/svg_to_pdf.py, don't hand-edit
    listing.md    Etsy listing copy — fill in from docs/etsy-listing-template.md
```

## Building a product
1. Drop finished SVG pages into `<product-slug>/svg/`.
2. Run:
   ```
   python3 scripts/svg_to_pdf.py products/<product-slug>/svg products/<product-slug>/pdf
   ```
3. Fill out `<product-slug>/listing.md` using `docs/etsy-listing-template.md`.
4. Upload the PDF(s) as digital files on the Etsy listing; use one SVG page (or a mockup) as the listing's cover image.

## Naming convention
`<product-slug>` = lowercase, hyphenated, matches the Etsy listing title (e.g. `garden-folk-coloring-set`).
Page files: `01-mushroom-cottage.svg`, `02-snail-mail.svg`, etc. — numeric prefix controls PDF page order.
