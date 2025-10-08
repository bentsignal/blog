import { ConvexError } from "convex/values";
import { query } from "./_generated/server";

export const getDefault = query({
  handler: async (ctx) => {
    const channel = await ctx.db.query("channels").first();
    if (!channel) throw new ConvexError("Channel not found");
    return channel;
  },
});
