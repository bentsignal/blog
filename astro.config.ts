import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import remarkCallouts from "./src/lib/remark-callouts";
import remarkVideo from "./src/lib/remark-video";

export default defineConfig({
  site: "https://blog.bentsignal.com",
  integrations: [react(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: true,
    },
  },
  markdown: {
    remarkPlugins: [remarkGfm, remarkCallouts, remarkVideo],
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      theme: "nord",
    },
  },
});
