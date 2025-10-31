import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const snapshot = v.object({
  content: v.string(),
  timestamp: v.number(),
});

export default defineSchema({
  channels: defineTable({
    name: v.string(),
    post: v.optional(v.id("posts")),
    slug: v.optional(v.string()),
  }).searchIndex("search_channel_name", {
    searchField: "name",
  }),
  posts: defineTable({
    title: v.string(),
    subtitle: v.string(),
    slug: v.string(),
    channel: v.id("channels"),
  })
    .searchIndex("search_post_title", {
      searchField: "title",
    })
    .index("by_slug", ["slug"]),
  messages: defineTable({
    snapshots: v.array(snapshot),
    profile: v.id("profiles"),
    channel: v.optional(v.id("channels")),
    // slug is intentionally a string and not vSlug. User queries should be validated against
    // active slugs (vSlug), but if the field is a string I can temporarily take down a post/channel
    // without permanently deleting or altering the messages in the db.
    slug: v.optional(v.string()),
    replyTo: v.optional(v.id("messages")),
  })
    .index("by_channel", ["channel"])
    .index("by_slug", ["slug"]),
  profiles: defineTable({
    user: v.string(),
    name: v.string(),
    imageKey: v.optional(v.string()),
  }).index("by_user", ["user"]),
});
