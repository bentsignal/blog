import { defaultNotificationSettings } from "@/types/notification-types";
import { internalMutation } from "./_generated/server";

export const unreadAll = internalMutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) {
      await ctx.db.patch(message._id, {
        seenBy: [],
      });
    }
  },
});

export const createPreferences = internalMutation({
  handler: async (ctx) => {
    const profiles = await ctx.db.query("profiles").collect();
    for (const profile of profiles) {
      await ctx.db.insert("preferences", {
        profile: profile._id,
        notifications: defaultNotificationSettings,
      });
    }
  },
});

export const createEmptyReactionArray = internalMutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) {
      await ctx.db.patch(message._id, {
        reactions: [],
      });
    }
  },
});
