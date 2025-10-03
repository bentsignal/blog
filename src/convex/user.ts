import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";

export type Profile = {
  name: string;
  image: string | null | undefined;
};

export const getProfile = async (
  ctx: MutationCtx | QueryCtx,
  userId: string,
) => {
  const profile = await ctx.db
    .query("profiles")
    .withIndex("by_user", (q) => q.eq("user", userId))
    .first();
  if (!profile) throw new ConvexError("Profile not found");
  return profile;
};

export const updatePFP = internalMutation({
  args: {
    profileId: v.id("profiles"),
    key: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      imageKey: args.key,
    });
  },
});
