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
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
    ],
    // pfp's next to message are 40px, pfp for user in top right is 28px
    imageSizes: [40, 28],
  },
};

export default nextConfig;
