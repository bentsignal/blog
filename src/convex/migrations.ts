import { internalMutation } from "./_generated/server";
import { authComponent } from "./auth";

export const migrateToProfiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    const dedupedUsers = [...new Set(messages.map((message) => message.user))];
    const users = await Promise.all(
      dedupedUsers.map((user) => authComponent.getAnyUserById(ctx, user)),
    );
    for (const user of users) {
      if (!user) continue;
      await ctx.db.insert("profiles", {
        user: user._id,
        name: user.name!,
        image: user.image!,
      });
    }
    for (const message of messages) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("user", message.user))
        .first();
      if (!profile) continue;
      await ctx.db.patch(message._id, {
        profile: profile._id,
      });
    }
  },
});
