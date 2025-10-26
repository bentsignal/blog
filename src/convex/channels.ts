import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const trimmedSearchTerm = args.searchTerm.trim();
    let channels;
    if (trimmedSearchTerm.length > 0) {
      channels = await ctx.db
        .query("channels")
        .withSearchIndex("search_channel_name", (q) =>
          q.search("name", trimmedSearchTerm),
        )
        .paginate(args.paginationOpts);
    } else {
      channels = await ctx.db.query("channels").paginate(args.paginationOpts);
    }
    return channels;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("channels").collect();
  },
});
