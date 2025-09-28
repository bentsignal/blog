import { WebhookEvent } from "@clerk/nextjs/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk/events",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("Missing required headers");
      return new Response("Missing required headers", { status: 400 });
    }
    const payload = await request.json();
    const body = JSON.stringify(payload);
    let event: WebhookEvent;
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("CLERK_WEBHOOK_SECRET is not set");
      return new Response("Internal server configuration error", {
        status: 500,
      });
    }
    try {
      const wh = new Webhook(secret);
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return new Response("Webhook verification failed", { status: 401 });
    }
    if (event.type === "user.created") {
      const { id } = event.data;
      const pfp = event.data.image_url;
      const username = event.data.username;
      if (username === null) {
        console.error("Username is required for user creation");
        return new Response("Username is required", { status: 400 });
      }
      await ctx.runMutation(internal.user.create, {
        userId: id,
        username,
        pfp,
      });
    }
    return new Response("OK", { status: 200 });
  }),
});

export default http;
