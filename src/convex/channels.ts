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
    const channelsWithMessagePreviews = await Promise.all(
      channels.page.map(async (channel) => {
        const message = await ctx.db
          .query("messages")
          .withIndex("by_channel", (q) => q.eq("channel", channel._id))
          .order("desc")
          .first();
        if (!message)
          return {
            ...channel,
            messagePreview: null,
          };
        const profile = await ctx.db.get(message.profile);
        if (!profile)
          return {
            ...channel,
            messagePreview: null,
          };
        const previewString = `${profile.name}: ${message.snapshots[0]?.content}`;
        return {
          ...channel,
          messagePreview: previewString,
        };
      }),
    );
    return {
      ...channels,
      page: channelsWithMessagePreviews,
    };
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("channels").collect();
  },
});
