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
    // slug is intentionally a string and not vSlug. User queries should be validated against
    // active slugs (vSlug), but if the field is a string I can temporarily take down a post/channel
    // without permanently deleting or altering the messages in the db.
    slug: v.string(),
    replyTo: v.optional(v.id("messages")),
  }).index("by_slug", ["slug"]),
  profiles: defineTable({
    user: v.string(),
    name: v.string(),
    imageKey: v.optional(v.string()),
  }).index("by_user", ["user"]),
});
