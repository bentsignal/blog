import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const create = internalMutation({
  args: {
    userId: v.string(),
    username: v.string(),
    pfp: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId, username, pfp } = args;
    await ctx.db.insert("users", {
      userId,
      username,
      pfp,
    });
  },
});
