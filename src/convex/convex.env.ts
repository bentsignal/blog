import { createEnv } from "convex-env";
import { betterAuth, oAuth, uploadthing } from "convex-env/presets";
import { v } from "convex/values";

export const schema = {
  ...betterAuth,
  ...oAuth.github,
  ...uploadthing,
  SITE_URL: v.string(),
  INBOUND_API_KEY: v.string(),
};

export const env = createEnv({
  schema,
  options: {
    skipValidation: true,
  },
});
