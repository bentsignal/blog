"use node";

import { env } from "@/convex/convex.env";
import { Inbound } from "@inboundemail/sdk";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { ActionCtx, internalAction } from "../_generated/server";
import renderReplyNotificationEmail from "./templates";

const inbound = new Inbound(env.INBOUND_API_KEY);

const sendReply = async (
  ctx: ActionCtx,
  args: { recipientProfileId: Id<"profiles"> },
) => {
  const preferences = await ctx.runQuery(internal.preferences.getByProfileId, {
    profileId: args.recipientProfileId,
  });
  if (preferences.notifications.replies === false) return;
  const [user, messages] = await Promise.all([
    ctx.runQuery(internal.user.getUserByProfileId, {
      profileId: args.recipientProfileId,
    }),
    ctx.runQuery(internal.notifications.getMessages, {
      recipientProfileId: args.recipientProfileId,
    }),
  ]);
  if (messages.length === 0) return;
  const emailContent = await renderReplyNotificationEmail({
    messages,
    userId: user._id,
  });
  const { error } = await inbound.emails.send({
    from: "bentsignal <notifications@mail.bentsignal.com>",
    to: user.email,
    subject: `🔔 You have ${messages.length} new replies to your messages`,
    html: emailContent,
  });
  if (error) throw new Error(error);
};

export const sendReplyNotification = internalAction({
  args: {
    recipientProfileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    try {
      await sendReply(ctx, args);
    } catch (error) {
      console.error(
        "Failed to send reply notification for user: ",
        args.recipientProfileId,
      );
      console.error(error);
    } finally {
      await ctx.runMutation(internal.notifications.deleteOne, {
        recipientProfileId: args.recipientProfileId,
      });
    }
  },
});
