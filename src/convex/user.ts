import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";
import { authedQuery } from "./convex_helpers";
import { getFileURL } from "./uploadthing";

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

export const getInfo = authedQuery({
  handler: async (ctx) => {
    const profile = await getProfile(ctx, ctx.user.subject);
    return {
      name: profile.name,
      image: profile.imageKey ? getFileURL(profile.imageKey) : null,
      profileId: profile._id,
    };
  },
});

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
