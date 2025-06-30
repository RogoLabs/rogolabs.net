# RogoLabs.net

A professional portfolio and project showcase for Jerry Gamblin, featuring cybersecurity tools and research.

## Project Structure

```
.
├── Web/                    # Web root directory (note capital 'W')
│   ├── index.html          # Main HTML file
│   └── README.md           # Web directory documentation
├── .github/workflows/      # GitHub Actions workflow
│   └── deploy.yml          # Deployment configuration
└── README.md               # This file
```

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/jgamblin/rogolabs.net.git
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
   www.rogolabs.net  CNAME   jgamblin.github.io
   ```

2. In your GitHub repository, go to Settings > Pages and add your custom domain.

## License

This project is open source and available under the [MIT License](LICENSE).
