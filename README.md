# Portfolio Site

Personal portfolio built with Astro and Tailwind CSS. Pulls live GitHub project data, supports light/dark theming, and deploys to Cloudflare Pages.

## Stack

Astro, TypeScript, Tailwind CSS 4, Cloudflare Pages

## Setup

```bash
npm install
npm run dev        # localhost:4321
npm run build
```

Create `.env`:
```
GH_GIST_TOKEN=your_github_token     # for syncing resume to gist
GH_DEV_TOKEN=your_github_token      # for fetching projects
```

## Deploy

Connected to Cloudflare Pages. Pushes to `main` trigger automatic builds.

**Initial setup:**
1. Connect repo in Cloudflare Pages
2. Build command: `npm run build`
3. Output: `dist/`
4. Add environment variables in Cloudflare dashboard

## License

ISC
