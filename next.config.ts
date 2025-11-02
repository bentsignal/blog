import { env } from "@/env";
import bundleAnalyzer from "@next/bundle-analyzer";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${env.UPLOADTHING_ORG_ID}.ufs.sh`,
        port: "",
        pathname: "/f/**",
        search: "",
      },
    ],
    imageSizes: [40],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

// doesn't work with turbopack currently
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withMDX(withBundleAnalyzer(nextConfig));
