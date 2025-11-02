# Cloudflare Pages Deployment Guide

## Setup Instructions

### 1. Connect GitHub Repository to Cloudflare Pages

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
3. Select your GitHub repository: `jonathon-hackbarth/portfolio-site`
4. Configure build settings:
   - **Production branch**: `main` (or `develop` if deploying from develop)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave blank)

### 2. Add Environment Variables

In your Cloudflare Pages project settings, add the following environment variable:

- **Variable name**: `GH_TOKEN`
- **Value**: Your GitHub Personal Access Token (same one from your `.env` file)
- **Environment**: Production (and Preview if needed)

### 3. Setup Weekly Rebuild (Optional)

To keep your GitHub projects fresh with weekly automatic rebuilds:

1. In Cloudflare Pages project settings, go to **Settings** > **Builds & deployments**
2. Scroll to **Deploy hooks** and create a new deploy hook
3. Copy the deploy hook URL
4. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**
5. Add a new repository secret:
   - **Name**: `CLOUDFLARE_DEPLOY_HOOK`
   - **Value**: The deploy hook URL you copied

The GitHub Action in `.github/workflows/weekly-rebuild.yml` will automatically trigger a rebuild every Sunday at 2 AM UTC.

### 4. Custom Domain (Already configured)

Since your domain `jonathonhackbarth.com` is already on Cloudflare:

1. Go to your Cloudflare Pages project
2. Navigate to **Custom domains**
3. Add `jonathonhackbarth.com` (and `www.jonathonhackbarth.com` if desired)
4. Cloudflare will automatically configure DNS settings

## Build Information

- **Framework preset**: Astro
- **Node version**: Use default (or specify in package.json if needed)
- **Environment variables required**: `GH_TOKEN`

## Deployment Status

After setup, Cloudflare Pages will:

- Automatically deploy on every push to your production branch
- Generate preview deployments for pull requests
- Rebuild weekly via GitHub Actions (if deploy hook is configured)

## Troubleshooting

If builds fail:

1. Check build logs in Cloudflare Pages dashboard
2. Verify `GH_TOKEN` is set correctly in environment variables
3. Ensure all dependencies are in `package.json` (not just `devDependencies`)
4. Check that build command produces output in `dist` directory
