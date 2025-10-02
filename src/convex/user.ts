import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "./_generated/server";

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
