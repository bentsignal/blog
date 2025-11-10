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
