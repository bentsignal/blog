import { createEnv } from "convex-env";
import { v } from "convex/values";

export const schema = {
  CONVEX_SITE_URL: v.string(),
  SITE_URL: v.string(),
  BETTER_AUTH_SECRET: v.string(),
  GITHUB_CLIENT_ID: v.string(),
  GITHUB_CLIENT_SECRET: v.string(),
  UPLOADTHING_TOKEN: v.string(),
  UPLOADTHING_ORG_ID: v.string(),
  INBOUND_API_KEY: v.string(),
};

export const env = createEnv({
  schema,
  options: {
    skipValidation: true,
  },
});
