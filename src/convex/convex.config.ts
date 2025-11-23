import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";
import { verifyEnv } from "./convex.env";

verifyEnv();

const app = defineApp();
app.use(betterAuth);
app.use(rateLimiter);

export default app;
