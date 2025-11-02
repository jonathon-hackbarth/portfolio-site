import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://jonathonhackbarth.com",
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss() as any],
  },
  integrations: [sitemap()],
  output: "static",
});
