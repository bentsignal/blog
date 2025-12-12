import { validate } from "convex-helpers/validators";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  MutationCtx,
} from "./_generated/server";
import { getFileURL } from "./uploadthing";
import type { EnhancedMessage } from "@/features/messages/types";
import { getTimeInMs } from "@/utils/time-utils";
import {
  getMessageContent,
  getReactionsSignature,
} from "@/features/messages/utils";
import {
  NotificationType,
  vNotificationType,
} from "@/types/notification-types";

export const validateNotificationType = (value: string) => {
  const valueIsValid = validate(vNotificationType, value);
  if (valueIsValid) return value as NotificationType;
  return null;
};

export const notifyUserOfReplyToTheirMessage = async ({
  ctx,
  idOfReplyMessage,
  idOfRecipientMessage,
  sendersProfile,
}: {
  ctx: MutationCtx;
  idOfReplyMessage: Id<"messages">;
  idOfRecipientMessage: Id<"messages">;
  sendersProfile: Id<"profiles">;
}) => {
  const messageBeingRepliedTo = await ctx.db.get(idOfRecipientMessage);
  if (!messageBeingRepliedTo) return;
  if (messageBeingRepliedTo.profile === sendersProfile) return;
  const recipientProfile = await ctx.db.get(messageBeingRepliedTo.profile);
  if (!recipientProfile) return;
  const scheduledNotification = await ctx.db
    .query("notifications")
    .withIndex("by_recipient", (q) => q.eq("recipient", recipientProfile._id))
    .first();
  if (scheduledNotification) {
    await ctx.db.patch(scheduledNotification._id, {
      messages: [...scheduledNotification.messages, idOfReplyMessage],
    });
    return;
  }
  const scheduledTaskId = await ctx.scheduler.runAfter(
    getTimeInMs({ hours: 24 }),
    internal.email.actions.sendReplyNotification,
    {
      recipientProfileId: messageBeingRepliedTo.profile,
    },
  );
  await ctx.db.insert("notifications", {
    messages: [idOfReplyMessage],
    recipient: recipientProfile._id,
    taskId: scheduledTaskId,
  });
};

export const getMessages = internalQuery({
  args: {
    recipientProfileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) =>
        q.eq("recipient", args.recipientProfileId),
      )
      .first();
    if (!notification) return [];
    const messages = await Promise.all(
      notification.messages.map((messageId) => ctx.db.get(messageId)),
    );
    const filteredReplies = messages
      .filter((message) => message !== null)
      .filter((message) => message.replyTo !== undefined)
      .filter((message) =>
        message.seenBy.every(
          (viewer) => viewer.profile !== args.recipientProfileId,
        ),
      );
    const results = await Promise.all(
      filteredReplies.map(async (replyMessage) => {
        const replierProfile = await ctx.db.get(replyMessage.profile);
        const replyMessageEnhanced = {
          ...replyMessage,
          name: replierProfile?.name ?? "Unknown",
          pfp: replierProfile?.imageKey
            ? getFileURL(replierProfile.imageKey)
            : null,
          username: replierProfile?.username ?? "",
          content: getMessageContent(replyMessage.snapshots),
          reactionSignature: getReactionsSignature(replyMessage.reactions),
        } satisfies EnhancedMessage;
        if (!replyMessage.replyTo) return null;
        const originalMessage = await ctx.db.get(replyMessage.replyTo);
        if (!originalMessage) return null;
        const originalProfile = await ctx.db.get(originalMessage.profile);
        if (!originalProfile) return null;
        const originalMessageEnhanced = {
          ...originalMessage,
          name: originalProfile?.name ?? "Unknown",
          pfp: originalProfile?.imageKey
            ? getFileURL(originalProfile.imageKey)
            : null,
          username: originalProfile?.username ?? "",
          content: getMessageContent(originalMessage.snapshots),
          reactionSignature: getReactionsSignature(originalMessage.reactions),
        } satisfies EnhancedMessage;
        return {
          originalMessage: originalMessageEnhanced,
          replyMessage: replyMessageEnhanced,
        };
      }),
    );
    return results.filter((result) => result !== null);
  },
});

export const deleteOne = internalMutation({
  args: {
    recipientProfileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const notification = await ctx.db
      .query("notifications")
      .withIndex("by_recipient", (q) =>
        q.eq("recipient", args.recipientProfileId),
      )
      .first();
    if (!notification) return;
    await ctx.db.delete(notification._id);
  },
});

export const deleteAllForUser = async (
  ctx: MutationCtx,
  profileId: Id<"profiles">,
) => {
  const notifications = await ctx.db
    .query("notifications")
    .withIndex("by_recipient", (q) => q.eq("recipient", profileId))
    .collect();
  for (const notification of notifications) {
    await ctx.scheduler.cancel(notification.taskId);
  }
  for (const notification of notifications) {
    await ctx.db.delete(notification._id);
  }
};
