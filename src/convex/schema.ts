import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    content: v.string(),
    user: v.string(),
    profile: v.optional(v.id("profiles")),
  }),
  profiles: defineTable({
    user: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
  }).index("by_user", ["user"]),
});
