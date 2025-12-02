# Portfolio Site

Modern personal portfolio built with Astro and Tailwind CSS. Static site with build-time rendering, minimal JavaScript, featuring live GitHub project data and a light/dark/auto theme switcher.

## Tech Stack

- **Framework**: Astro (static site generation)
- **Styling**: Tailwind CSS v4 + CSS custom properties
- **Language**: TypeScript (strict mode)
- **Deployment**: Cloudflare Pages
- **Testing**: Vitest

## Features

- Static site generation with build-time GitHub API integration
- TypeScript throughout (scripts, utilities, components)
- Light/Dark/Auto theme with system preference detection
- SEO optimized (Open Graph, Twitter Cards, JSON-LD schema, sitemap)
- Accessible (ARIA labels, semantic HTML, keyboard navigation)
- Progressive enhancement for clipboard functionality

## Project Structure

```text
src/
  components/     Astro components (Hero, NavBar, Projects, ProjectCard)
  layouts/        Base HTML layout with metadata
  pages/          Route pages
  scripts/        TypeScript client scripts (theme, navigation, clipboard)
  styles/         Global CSS with design tokens
  utils/          Data fetching and transformation
tests/            Vitest unit tests
```

## Development

**Prerequisites**: Node.js, npm

**Environment Variables**: Create a `.env` file:

```text
GH_TOKEN=your_github_personal_access_token
```

The GitHub token enables authenticated API requests for fetching repository data and language statistics.

**Commands**:

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:4321)
npm run build        # Production build
npm run preview      # Preview production build (requires wrangler)
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## Deployment

### Cloudflare Pages Setup

1. **Connect Repository**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to Workers & Pages > Create application > Pages > Connect to Git
   - Select repository: `jonathon-hackbarth/portfolio-site`

2. **Build Settings**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

3. **Environment Variables**
   - Add `GH_TOKEN` with your GitHub Personal Access Token
   - Apply to Production (and Preview if needed)

4. **Custom Domain** (Optional)
   - Add custom domain in Cloudflare Pages settings
   - DNS is automatically configured for Cloudflare-managed domains

### Automatic Deployments

- Production deploys trigger on pushes to `main` branch
- Preview deploys are created for pull requests
- Weekly rebuilds run every Sunday at 2 AM UTC via GitHub Actions

## Testing

Current test coverage:

- Language percentage calculations
- Error handling for missing tokens
- GitHub API data transformation

## License

ISC
