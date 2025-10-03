import { env } from "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
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
};

export default nextConfig;
