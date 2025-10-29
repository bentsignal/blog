import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, query, QueryCtx } from "./_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("posts").collect();
  },
});

export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getPostSlugById = async (
  ctx: MutationCtx | QueryCtx,
  postId?: Id<"posts">,
) => {
  if (!postId) return undefined;
  const post = await ctx.db.get(postId);
  if (!post) return undefined;
  return post.slug;
};
