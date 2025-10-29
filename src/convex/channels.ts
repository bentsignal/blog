import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getPostSlugById } from "./posts";

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
    const channelsWithMetadata = await Promise.all(
      channels.page.map(async (channel) => {
        const [slug, previewMessage] = await Promise.all([
          getPostSlugById(ctx, channel.post),
          getPreviewMessageForChannel(ctx, channel._id),
        ]);
        return {
          data: channel,
          slug,
          previewMessage,
        };
      }),
    );
    return {
      ...channels,
      page: channelsWithMetadata,
    };
  },
});

export const getById = query({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("channels").collect();
  },
});

const getPreviewMessageForChannel = async (
  ctx: MutationCtx | QueryCtx,
  channelId: Id<"channels">,
) => {
  const message = await ctx.db
    .query("messages")
    .withIndex("by_channel", (q) => q.eq("channel", channelId))
    .order("desc")
    .first();
  if (!message) return undefined;
  const profile = await ctx.db.get(message.profile);
  if (!profile) return undefined;
  return `${profile.name}: ${message.snapshots[0]?.content}`;
};
