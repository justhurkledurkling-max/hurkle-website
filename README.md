# Hurkle Durkling — Website

Cozy, hand-drawn homepage for the Hurkle Durkling digital craft shop, built as a static HTML site for deployment via IONOS Deploy Now.

## Structure
- `index.html` — the full homepage (HTML + CSS in one file, no build step needed)

## Deploying to GitHub → IONOS Deploy Now

1. Create a new repository on GitHub (e.g. `hurkle-durkling-website`) — public or private both work.
2. In this folder, run:
   ```
   git init -b main
   git add .
   git commit -m "Initial homepage"
   git remote add origin https://github.com/YOUR-USERNAME/hurkle-durkling-website.git
   git push -u origin main
   ```
3. In the IONOS Control Panel, go to **Deploy Now → Add new project**, link your GitHub account, and select this repository.
4. Choose **Static** as the project type. Deploy Now will detect `index.html` automatically as the entry point.
5. Under the project's domain settings, connect `justhurkledurkling.com` as the Production Deployment domain.
6. IONOS will auto-issue an SSL certificate — your site will be live at `https://justhurkledurkling.com`.

From then on, any update to `index.html` pushed to the `main` branch on GitHub will automatically redeploy the live site.

## Still to fill in
- Real links for Etsy, Pinterest, and Shopify (currently placeholder `#`)
- Real product images/previews to replace the placeholder SVG icons
- Confirm the contact email
