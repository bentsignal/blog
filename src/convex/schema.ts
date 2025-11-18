import { vSlug } from "@/data/slugs";
import { vReaction, vSnapshot } from "@/types/message-types";
import { vNotificationSettings } from "@/types/notification-types";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    snapshots: v.array(vSnapshot),
    profile: v.id("profiles"),
    slug: vSlug,
    replyTo: v.optional(v.id("messages")),
    seenBy: v.array(
      v.object({
        profile: v.id("profiles"),
        timestamp: v.number(),
      }),
    ),
    reactions: v.array(vReaction),
  }).index("by_slug", ["slug"]),
  profiles: defineTable({
    user: v.string(),
    name: v.string(),
    imageKey: v.optional(v.string()),
  }).index("by_user", ["user"]),
  notifications: defineTable({
    messages: v.array(v.id("messages")),
    recipient: v.id("profiles"),
    taskId: v.id("_scheduled_functions"),
  }).index("by_recipient", ["recipient"]),
  preferences: defineTable({
    profile: v.id("profiles"),
    notifications: vNotificationSettings,
  }).index("by_profile", ["profile"]),
});
