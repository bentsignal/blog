import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) throw new ConvexError("Unauthorized");
    return await ctx.db.query("messages").collect();
  },
});
