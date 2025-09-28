import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    content: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    username: v.string(),
    userId: v.string(),
    pfp: v.string(),
  }).index("by_user_id", ["userId"]),
});
