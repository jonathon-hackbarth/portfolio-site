import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://jonathonhackbarth.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap()],
  output: "server",
  adapter: vercel({
    imageService: true,
    webAnalytics: { enabled: true },
  }),
});
