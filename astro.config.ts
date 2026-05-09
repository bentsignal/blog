import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import remarkCallouts from "./src/lib/remark-callouts";
import remarkVideo from "./src/lib/remark-video";
import rehypeExternalLinks from "./src/lib/rehype-external-links";
import { siteOrigin } from "./src/lib/site";

export default defineConfig({
  site: siteOrigin,
  prefetch: true,
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
  markdown: {
    remarkPlugins: [remarkGfm, remarkCallouts, remarkVideo],
    rehypePlugins: [rehypeSlug, rehypeExternalLinks],
    shikiConfig: {
      theme: "nord",
    },
  },
});
