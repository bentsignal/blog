import { ConvexError, v } from "convex/values";
import {
  notificationState,
  vNotificationType,
} from "../types/notification-types";
import { Id } from "./_generated/dataModel";
import { internalQuery, mutation, MutationCtx } from "./_generated/server";
import { getProfileByUserId } from "./user";

export const getByProfileId = internalQuery({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const preferences = await ctx.db
      .query("preferences")
      .withIndex("by_profile", (q) => q.eq("profile", args.profileId))
      .first();
    if (!preferences) throw new ConvexError("Preferences not found");
    return preferences;
  },
});

export const unsubscribe = mutation({
  args: {
    userId: v.string(),
    type: vNotificationType,
  },
  handler: async (ctx, args) => {
    const profile = await getProfileByUserId(ctx, args.userId);
    if (!profile) return;
    const preferences = await ctx.db
      .query("preferences")
      .withIndex("by_profile", (q) => q.eq("profile", profile._id))
      .first();
    if (!preferences) return;
    const notifications = {
      ...notificationState(preferences.notifications),
      [args.type]: false,
    };
    await ctx.db.patch(preferences._id, {
      notifications,
    });
  },
});

export const deleteForUser = async (
  ctx: MutationCtx,
  profileId: Id<"profiles">,
) => {
  const preferences = await ctx.db
    .query("preferences")
    .withIndex("by_profile", (q) => q.eq("profile", profileId))
    .first();
  if (!preferences) return;
  await ctx.db.delete(preferences._id);
};
