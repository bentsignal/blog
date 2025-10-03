import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";
import { verifyEnv } from "./convex.env";

verifyEnv();

const app = defineApp();
app.use(betterAuth);
app.use(rateLimiter);

export default app;
