import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const client = createAuthClient({
  plugins: [convexClient()],
});
