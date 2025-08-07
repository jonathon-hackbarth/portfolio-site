<div align="center">

# Portfolio Site (Astro + Partial Hydration)

Modern, performant personal portfolio built with **Astro**, **React (selective)**, and **Tailwind CSS**—optimized for fast initial paint, minimal JavaScript, and live GitHub project data with caching.

</div>

## ✨ Features

- **Astro SSR + edge-friendly caching** (Vercel adapter, `s-maxage` + `stale-while-revalidate`)
- **Server-rendered project list** with GitHub API aggregation (languages % computed server-side)
- **In-memory + HTTP caching** (ETag, 304, rate limit awareness)
- **Minimal client JS**: only progressive enhancement for copy-to-clipboard
- **Responsive optimized image** in hero (explicit dimensions, WebP)
- **SEO & metadata**: canonical URL, Open Graph/Twitter tags, JSON-LD Person, sitemap
- **Accessible actions**: ARIA labeling, keyboard-friendly buttons (continuing improvements planned)
- **Typed codebase** (TypeScript + strict util layer)
- **Unit tests** (Vitest) for core data transformation

## 🗂 Tech Stack

| Layer            | Choice / Notes |
|------------------|----------------|
| Framework        | Astro (server output on Vercel) |
| Styling          | Tailwind CSS (via `@tailwindcss/vite`) + component layer classes |
| Icons            | `@fortawesome/react-fontawesome` (tree-shaken icon imports) |
| Data Fetching    | Native `fetch` (GitHub REST v3) |
| Caching          | In-memory per cold start + HTTP cache headers |
| Deployment       | Vercel (@astrojs/vercel adapter) |
| Testing          | Vitest |

## 🔑 Environment Variables

Create a `.env` (not committed) or configure in Vercel:

```
GH_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxx   # GitHub Personal Access Token (no special scopes needed for public repos)
```

| Var       | Required | Purpose |
|-----------|----------|---------|
| `GH_TOKEN`| Yes      | Authenticated requests raise rate limits & allow language stats fetch |

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

Current test coverage focuses on:
1. `getProjectsData` language percentage math
2. Error path (missing token)

Suggested future tests:
- API integration (simulate rate limit & 304)
- Rendering snapshot for project cards
- Accessibility smoke (axe / aria roles)

## 🗃 Project Structure (Relevant)

```
src/
	components/        UI building blocks (.astro + minimal React previously)
	layouts/           Base layout & metadata
	pages/             Routes (index + API endpoint)
	utils/             Data + transformation logic
	styles/global.css  Tailwind layer + component classes
```

## 🌐 SEO & Metadata

- Canonical + sitemap generation (`@astrojs/sitemap`)
- JSON-LD Person schema embedded
- Placeholder social image reference (`/social-image.png`) – supply/replace with a generated OG image

## 📦 Caching Strategy

| Layer        | Strategy |
|--------------|----------|
| GitHub API   | Authenticated requests; language sub-requests aggregated per repo |
| API Route    | In-memory (1h TTL) + ETag + `s-maxage=3600, stale-while-revalidate=86400` |
| Browser      | Relies on HTTP freshness + 304 validation |

Rate limit handling returns `429` with reset timestamp.

## 🛡 Security / Hardening Roadmap

- [ ] Add Content Security Policy (nonce or hash-based)
- [x] Add `robots.txt` (with sitemap reference)
- [ ] OG image automation (dynamic generation or static build step)
- [x] Replace heading `!important` overrides with CSS variables (begin token system)

## ♿ Accessibility Roadmap

- [ ] Live region feedback for copy action
- [ ] Landmarks (`<header>`, `<main>`, `<footer>` wrappers)
- [ ] Keyboard focus ring review & contrast audit

## 🧭 Development Scripts

| Command            | Description |
|--------------------|-------------|
| `npm run dev`      | Start local dev server |
| `npm run build`    | Production build (Vercel server output) |
| `npm run preview`  | Preview production build |
| `npm run test`     | Run unit tests |
| `npm run test:watch` | Watch tests |

## 🔄 Deployment

Pushed to `main` -> Vercel (auto build). Ensure `GH_TOKEN` is configured in Vercel project settings.

## 🧩 Removing Legacy Code

React island for projects was replaced with server-rendered Astro. Legacy React components (`ProjectsIsland`, `ProjectCardReact`) have been removed to eliminate unused JS.

## 📌 Roadmap (Next Candidates)

- Integrate API integration test & contract test for rate limiting
- Real OG/social image (generated or static)
- Introduce design token system (CSS variables) and dark mode toggle
- Add project filtering or tags client-side (progressive enhancement)

## 📄 License

ISC

---

Questions or ideas for improvement—feel free to open an issue or iterate directly.
