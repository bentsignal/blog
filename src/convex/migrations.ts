import { internalMutation } from "./_generated/server";

export const slugMigration = internalMutation({
  handler: async (ctx) => {
    const channels = await ctx.db.query("channels").collect();
    for (const channel of channels) {
      const messages = await ctx.db
        .query("messages")
        .withIndex("by_channel", (q) => q.eq("channel", channel._id))
        .collect();
      if (!channel.slug) {
        for (const message of messages) {
          ctx.db.delete(message._id);
        }
        await ctx.db.delete(channel._id);
        continue;
      }
      for (const message of messages) {
        ctx.db.patch(message._id, { slug: channel.slug });
      }
    }
  },
});
