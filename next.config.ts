import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig = {
  typedRoutes: true,
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `wr5t080c48.ufs.sh`,
        port: "",
        pathname: "/f/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "bsx-main.b-cdn.net",
        port: "",
        search: "",
      },
    ],
    localPatterns: [
      {
        pathname: "/src/assets/**",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
} satisfies NextConfig;

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-gfm"],
      ["remark-rehype", { footnoteBackContent: "↗" }],
    ],
    rehypePlugins: ["rehype-slug"],
  },
});

// doesn't work with turbopack currently
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withMDX(withBundleAnalyzer(nextConfig));
