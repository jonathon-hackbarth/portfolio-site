# Static Site Migration Plan

## Overview

Convert portfolio from SSR (Vercel) to static site (Cloudflare Pages) with build-time data fetching.

---

## Phase 1: Convert to Static Build

### 1.1 Update Astro Config

- Change `output: "server"` to `output: "static"`
- Remove Vercel adapter
- Remove adapter configuration

### 1.2 Fetch GitHub Data at Build Time

- Move GitHub API calls from runtime to build time
- Update `Projects.astro` to fetch data during build
- Pass data as props instead of fetching client-side

### 1.3 Remove Runtime API

- Delete `src/pages/api/github.ts`
- Remove `ProjectsIsland.tsx` (or refactor to accept props)
- Update imports in `index.astro`

### 1.4 Remove Middleware

- Delete `src/middleware.ts` (not needed for static sites)
- Move security headers to hosting platform config if needed

### 1.5 Test Static Build

```bash
npm run build
npm run preview
```

---

## Phase 2: Clean Up Dependencies

### 2.1 Remove Server Dependencies

```bash
npm uninstall @astrojs/vercel
```

### 2.2 Update package.json

- Remove unused dependencies
- Verify no dev-only dependencies in production

### 2.3 Audit Dependencies

```bash
npm audit --omit=dev
```

---

## Phase 3: Validate No Vulnerabilities

### 3.1 Run Security Audit

```bash
npm audit
```

### 3.2 Verify Clean Bill of Health

- Confirm `path-to-regexp` vulnerability is gone
- Check for any remaining high/critical issues

---

## Phase 4: Cloudflare Setup

### 4.1 Install Cloudflare Adapter

```bash
npm install @astrojs/cloudflare
```

### 4.2 Update Astro Config

- Add Cloudflare adapter
- Configure for static mode

### 4.3 Deploy to Cloudflare Pages

- Connect GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Add `GH_TOKEN` environment variable

### 4.4 Setup Weekly Rebuilds

- Create `.github/workflows/weekly-rebuild.yml`
- Configure cron schedule for Sunday midnight
- Add manual trigger option

---

## Phase 5: Verification & Cleanup

### 5.1 Test Production Deploy

- Verify site loads correctly
- Check all projects display
- Validate links work

### 5.2 Performance Check

- Test page load speed
- Verify static assets cached

### 5.3 Remove Old Files

- Delete `.vercel` directory
- Remove `.npmrc` if only for Vercel

### 5.4 Update Documentation

- Update README with new deployment info
- Document rebuild process

---

## Rollback Plan

If issues arise:

1. Revert `astro.config.ts` changes
2. Restore deleted files from git
3. Reinstall `@astrojs/vercel`
4. Redeploy to Vercel
