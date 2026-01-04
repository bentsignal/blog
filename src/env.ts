import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // only needed in prod
    CONVEX_DEPLOY_KEY: z.string().min(1).optional(),
    UPLOADTHING_APP_ID: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_CONVEX_URL: z.string().min(1),
    NEXT_PUBLIC_CONVEX_SITE_URL: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    CONVEX_DEPLOY_KEY: process.env.CONVEX_DEPLOY_KEY,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
