import { vSlug } from "@/data/slugs";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const snapshot = v.object({
  content: v.string(),
  timestamp: v.number(),
});

export default defineSchema({
  messages: defineTable({
    snapshots: v.array(snapshot),
    profile: v.id("profiles"),
    slug: vSlug,
    replyTo: v.optional(v.id("messages")),
  }).index("by_slug", ["slug"]),
  profiles: defineTable({
    user: v.string(),
    name: v.string(),
    imageKey: v.optional(v.string()),
  }).index("by_user", ["user"]),
});
