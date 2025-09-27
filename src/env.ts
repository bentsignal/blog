import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // clerk
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_JWT_ISSUER_DOMAIN: z.string().min(1),
    // convex (deployment key only needed in prod)
    CONVEX_DEPLOY_KEY: z.string().min(1).optional(),
  },
  client: {
    // clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.string().min(1),
    // convex
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
  },
  runtimeEnv: {
    // clerk
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_JWT_ISSUER_DOMAIN: process.env.CLERK_JWT_ISSUER_DOMAIN,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL:
      process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    // convex
    CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
  },
});
