# Hurkle Durkling

Digital craft shop — coloring pages, puzzles, and other 5-30 minute printable projects.

## Structure
- `index.html` — the homepage (HTML + CSS in one file, no build step needed)
- `products/` — one folder per product (source art → print-ready PDF → Etsy listing copy); see `products/README.md`
- `scripts/svg_to_pdf.py` — converts a product's SVG pages into a print-ready Letter-size PDF
- `docs/` — business docs: launch roadmap, Etsy checklist, buyer license text, listing template

## Repo
Connected to https://github.com/justhurkledurkling-max/hurkle-website — not yet pushed.
Push it yourself (this environment has no stored GitHub credentials):
```
git push -u origin main
```

## Deploying to GitHub → IONOS Deploy Now

1. Push this repo to GitHub (above).
2. In the IONOS Control Panel, go to **Deploy Now → Add new project**, link your GitHub account, and select this repository.
4. Choose **Static** as the project type. Deploy Now will detect `index.html` automatically as the entry point.
5. Under the project's domain settings, connect `justhurkledurkling.com` as the Production Deployment domain.
6. IONOS will auto-issue an SSL certificate — your site will be live at `https://justhurkledurkling.com`.

From then on, any update to `index.html` pushed to the `main` branch on GitHub will automatically redeploy the live site.

## Still to fill in
- Real links for Etsy, Pinterest, and Shopify (currently placeholder `#`)
- Real product images/previews to replace the placeholder SVG icons
- Confirm the contact email
