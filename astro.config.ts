import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://jonathonhackbarth.com",
  adapter: cloudflare(),
  image: {
    service: { entrypoint: "astro/assets/services/noop" },
  },
  vite: {
    plugins: [tailwindcss() as any],
  },
  integrations: [sitemap()],
  output: "static",
});
