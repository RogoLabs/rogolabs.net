# RogoLabs.net

A professional portfolio and project showcase for Jerry Gamblin, featuring cybersecurity tools and research.

## Project Structure

```
.
├── Web/                    # Web root, deployed to GitHub Pages (note capital 'W')
│   ├── index.html          # The whole site: about, toolkit, talks, JSON-LD structured data
│   ├── styles.css
│   ├── script.js
│   ├── Talks/              # Slide decks (PDF) linked from the Talks section
│   ├── icons/              # Favicons and app icons
│   ├── sitemap.xml, robots.txt, manifest.json, 404.html
├── .github/workflows/
│   ├── deploy.yml          # Deploys Web/ to GitHub Pages on push to main
│   ├── link-check.yml      # Weekly lychee link check (reports only, does not fail)
│   └── lighthouse.yml      # Lighthouse audit on pull requests
├── CNAME
└── README.md
```

## Adding a Talk

1. Put the slide PDF in `Web/Talks/` using a dashed filename with no spaces (e.g. `CVE-Panopticon.pdf`).
2. Add a `talk-item` at the top of `#talks-timeline` in `Web/index.html`, newest first.
3. Add a matching `Event` entry to the JSON-LD `@graph` near the top of `Web/index.html`.

The talks list collapses to the five most recent automatically; no script changes are needed.

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/RogoLabs/rogolabs.net.git
   cd rogolabs.net
   ```

2. Open the website locally:
   - Simply open `Web/index.html` in your browser, or
   - Use a local development server (e.g., Python's built-in server):
     ```bash
     cd Web
     python3 -m http.server 8000
     ```
     Then visit `http://localhost:8000` in your browser.

## Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions. The workflow is triggered on pushes to the `main` branch.

### Prerequisites

1. Ensure your repository is set up with GitHub Pages:
   - Go to Settings > Pages
   - Set Source to "GitHub Actions"
   - Under "Build and deployment", select "GitHub Actions"

2. (Optional) For custom domain setup:
   - In the repository Settings > Pages, enter your custom domain (rogolabs.net)
   - Follow GitHub's instructions to configure your DNS settings
   - Enable "Enforce HTTPS" once DNS propagates

### Manual Deployment

1. Commit and push your changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```

2. Monitor the deployment status in the "Actions" tab of your repository.

## Custom Domain Setup

1. In your DNS provider, add the following records:
   ```
   rogolabs.net      A       185.199.108.153
   rogolabs.net      A       185.199.109.153
   rogolabs.net      A       185.199.110.153
   rogolabs.net      A       185.199.111.153
   www.rogolabs.net  CNAME   rogolabs.github.io
   ```

2. In your GitHub repository, go to Settings > Pages and add your custom domain.

## License

This project is open source and available under the [MIT License](LICENSE).
