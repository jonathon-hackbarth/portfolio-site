<div align="center">

# Portfolio Site

Modern, performant personal portfolio built with **Astro** and **Tailwind CSS**—optimized for fast initial paint, minimal JavaScript, and live GitHub project data.

</div>

## ✨ Features

- **Astro static site generation** (deployed to Cloudflare Pages)
- **Server-rendered project list** with GitHub API aggregation (languages % computed server-side)
- **Minimal client JS**: only progressive enhancement for copy-to-clipboard
- **Responsive optimized images** with proper dimensions
- **SEO & metadata**: canonical URL, Open Graph/Twitter tags, JSON-LD Person schema, sitemap
- **Accessible actions**: ARIA labeling, keyboard-friendly buttons, semantic HTML
- **Theme switcher**: Light/Dark/Auto modes with system preference detection
- **Typed codebase** (TypeScript + strict util layer)
- **Unit tests** (Vitest) for core data transformation

## 🗂 Tech Stack

| Layer         | Choice / Notes                                             |
| ------------- | ---------------------------------------------------------- |
| Framework     | Astro (static site generation)                             |
| Styling       | Tailwind CSS (via `@tailwindcss/vite`) + custom properties |
| Icons         | Inline SVG                                                 |
| Data Fetching | Native `fetch` (GitHub REST v3)                            |
| Deployment    | Cloudflare Pages (@astrojs/cloudflare adapter)             |
| Testing       | Vitest                                                     |

## 🔑 Environment Variables

Create a `.env` (not committed) or configure in Cloudflare Pages:

```
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx   # GitHub Personal Access Token (no special scopes needed for public repos)
```

| Var        | Required | Purpose                                                               |
| ---------- | -------- | --------------------------------------------------------------------- |
| `GH_TOKEN` | Yes      | Authenticated requests raise rate limits & allow language stats fetch |

## 🚀 Getting Started

```bash
npm install
npm run dev
# Open http://localhost:4321
```

Production build:

```bash
npm run build
npm run preview
```

## 🧪 Testing

```bash
npm run test            # run once
npm run test:watch      # watch mode
```

Current test coverage:

- `getProjectsData` language percentage calculations
- Error handling (missing token)

## 🧭 Development Scripts

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start local dev server           |
| `npm run build`      | Production build (static output) |
| `npm run preview`    | Preview production build         |
| `npm run test`       | Run unit tests                   |
| `npm run test:watch` | Watch tests                      |

## 🔄 Deployment

Deployed to Cloudflare Pages. Ensure `GH_TOKEN` is configured in Cloudflare Pages environment variables.

## 🗃 Project Structure

```
src/
	components/        UI components (all Astro)
	layouts/           Base layout & metadata
	pages/             Routes (index page)
	utils/             Data fetching & transformation logic
	styles/global.css  Tailwind + custom CSS properties & theme system
```

## 🌐 SEO & Metadata

- Canonical + sitemap generation (`@astrojs/sitemap`)
- JSON-LD Person schema embedded
- Open Graph image using profile photo (`/og-image.png`)
- Favicon configured (`/favicon.ico`)

## 📦 Caching Strategy

| Layer      | Strategy                                                                  |
| ---------- | ------------------------------------------------------------------------- |
| GitHub API | Authenticated requests; language sub-requests aggregated per repo         |
| API Route  | In-memory (1h TTL) + ETag + `s-maxage=3600, stale-while-revalidate=86400` |
| Browser    | Relies on HTTP freshness + 304 validation                                 |

Rate limit handling returns `429` with reset timestamp.

## 🛡 Security / Hardening Roadmap

- [x] Add `robots.txt` (with sitemap reference)
- [x] Introduce security middleware (CSP + core headers) – tighten CSP later (remove 'unsafe-inline')
- [ ] Harden CSP with nonces & remove inline scripts
- [ ] OG image automation (dynamic generation or static build step)
- [x] Replace heading `!important` overrides with CSS variables (begin token system)

## ♿ Accessibility Roadmap

- [ ] Live region feedback for copy action
- [ ] Landmarks (`<header>`, `<main>`, `<footer>` wrappers)
- [ ] Keyboard focus ring review & contrast audit

## 🧭 Development Scripts

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Start local dev server                  |
| `npm run build`      | Production build (Vercel server output) |
| `npm run preview`    | Preview production build                |
| `npm run test`       | Run unit tests                          |
| `npm run test:watch` | Watch tests                             |

## 🔄 Deployment

Pushed to `main` -> Vercel (auto build). Ensure `GH_TOKEN` is configured in Vercel project settings.

## 🧩 Removing Legacy Code

React island for projects was replaced with server-rendered Astro. Legacy React components (`ProjectsIsland`, `ProjectCardReact`) have been removed to eliminate unused JS.

## 📌 Roadmap

- [ ] Add more comprehensive test coverage (rendering, accessibility)
- [ ] Custom OG image generation (possibly with headshot + branding)
- [ ] Project filtering/search functionality
- [ ] Performance monitoring integration
- [ ] Analytics integration

## 📄 License

ISC

---

Questions or ideas for improvement—feel free to open an issue.
