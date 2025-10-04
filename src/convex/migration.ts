import { internalMutation } from "./_generated/server";

export const migrateMessagesToSnapshots = internalMutation({
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    for (const message of messages) {
      if (!message._id || !message.content) continue;
      await ctx.db.patch(message._id, {
        snapshots: [
          { content: message.content, timestamp: message._creationTime },
        ],
        content: undefined,
      });
    }
  },
});
