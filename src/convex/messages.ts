import { channelSlugs } from "@/data/channels";
import { vSlug } from "@/data/slugs";
import { EnhancedMessage, vReactionEmoji } from "@/types/message-types";
import {
  getMessageContent,
  getReactionsSignature,
  validateMessage,
} from "@/utils/message-utils";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx, query } from "./_generated/server";
import { authedMutation } from "./convex_helpers";
import { rateLimiter } from "./limiter";
import { notifyUserOfReplyToTheirMessage } from "./notifications";
import { getFileURL } from "./uploadthing";
import { getProfileByUserId, type Profile } from "./user";

export const getPage = query({
  args: {
    slug: vSlug,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .filter((q) => q.neq(q.field("snapshots"), []))
      .order("desc")
      .paginate(args.paginationOpts);
    const repliedToMessages = await Promise.all(
      messages.page.map((message) =>
        message.replyTo ? ctx.db.get(message.replyTo) : null,
      ),
    );
    const messageProfiles = messages.page.map((message) => message.profile);
    const replyProfiles = repliedToMessages
      .map((msg) => (msg ? msg.profile : null))
      .filter((profile) => profile !== null);
    const allProfiles = [...messageProfiles, ...replyProfiles];
    const dedupedProfiles = [...new Set(allProfiles)];
    const profilesData = await Promise.all(
      dedupedProfiles.map((profile) => ctx.db.get(profile)),
    );
    const profilesMap = dedupedProfiles.reduce(
      (acc, profile, idx) => {
        const data = profilesData[idx];
        if (!data) return acc;
        acc[profile] = {
          name: data.name,
          image: data.imageKey ? getFileURL(data.imageKey) : null,
          username: data.username,
        };
        return acc;
      },
      {} as Record<string, Profile>,
    );

    return {
      ...messages,
      page: messages.page.map((message, idx) => {
        const user = profilesMap[message.profile];
        if (!user) throw new ConvexError("User not found");

        const repliedToMessage = repliedToMessages[idx];
        let reply: EnhancedMessage | undefined;
        if (repliedToMessage) {
          const profile = profilesMap[repliedToMessage.profile];
          if (!profile) throw new ConvexError("User not found");
          const replyContent = getMessageContent(repliedToMessage.snapshots);
          reply = {
            ...repliedToMessage,
            name: profile.name,
            username: profile.username,
            pfp: profile.image,
            content: replyContent,
            reactions: repliedToMessage.reactions,
            reactionSignature: getReactionsSignature(
              repliedToMessage.reactions,
            ),
          };
        }

        return {
          ...message,
          snapshots: message.snapshots.slice(-2),
          name: user.name,
          username: user.username,
          pfp: user.image,
          content: getMessageContent(message.snapshots),
          reply,
          reactions: message.reactions,
          reactionSignature: getReactionsSignature(message.reactions),
        } satisfies EnhancedMessage;
      }),
    };
  },
});

export const send = authedMutation({
  args: {
    content: v.string(),
    slug: vSlug,
    replyTo: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const validation = validateMessage(args.content);
    if (validation !== "Valid") throw new ConvexError(validation);
    const rateLimiterResponse = await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
    });
    if (rateLimiterResponse.ok === false) {
      throw new ConvexError(
        `Slow down! You're sending messages too fast. Try again in a few seconds.`,
      );
    }
    const sendersProfile = await getProfileByUserId(ctx, ctx.user.subject);
    const messageId = await ctx.db.insert("messages", {
      snapshots: [
        {
          content: args.content,
          timestamp: Date.now(),
        },
      ],
      profile: sendersProfile._id,
      slug: args.slug,
      replyTo: args.replyTo,
      seenBy: [],
      reactions: [],
    });
    if (args.replyTo) {
      await notifyUserOfReplyToTheirMessage({
        ctx,
        idOfReplyMessage: messageId,
        idOfRecipientMessage: args.replyTo,
        sendersProfile: sendersProfile._id,
      });
    }
  },
});

export const edit = authedMutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { content } = args;
    const validation = validateMessage(content);
    if (validation !== "Valid") throw new ConvexError(validation);
    const rateLimiterResponse = await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
    });
    if (rateLimiterResponse.ok === false) {
      throw new ConvexError(
        `Slow down! You're editing messages too fast. Try again in a few seconds.`,
      );
    }
    const userId = ctx.user.subject;
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError("Message not found");
    const messageContent = getMessageContent(message.snapshots);
    if (messageContent === null)
      throw new ConvexError("Message has been deleted");
    const profile = await getProfileByUserId(ctx, userId);
    if (message.profile !== profile._id) throw new ConvexError("Unauthorized");
    // only keep the most recent 10 snapshots
    const updatedSnapshots = [
      ...message.snapshots,
      {
        content: args.content,
        timestamp: Date.now(),
      },
    ].slice(-10);
    await ctx.db.patch(args.messageId, {
      snapshots: updatedSnapshots,
    });
  },
});

export const deleteOne = authedMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const rateLimiterResponse = await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
    });
    if (rateLimiterResponse.ok === false) {
      throw new ConvexError(
        `Slow down! You're deleting messages too fast. Try again in a few seconds.`,
      );
    }
    const userId = ctx.user.subject;
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError("Message not found");
    const profile = await getProfileByUserId(ctx, userId);
    if (message.profile !== profile._id) throw new ConvexError("Unauthorized");
    await ctx.db.patch(args.messageId, {
      snapshots: [],
    });
  },
});

export const deleteAllFromUser = async (
  ctx: MutationCtx,
  profileId: Id<"profiles">,
) => {
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("profile"), profileId))
    .collect();
  await Promise.all(
    messages.map((message) =>
      ctx.db.patch(message._id, {
        snapshots: [],
      }),
    ),
  );
};

export const getPreviewsForChannels = query({
  handler: async (ctx) => {
    const messages = await Promise.all(
      channelSlugs.map(async (slug) => {
        const message = await ctx.db
          .query("messages")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .order("desc")
          .filter((q) => q.neq(q.field("snapshots"), []))
          .first();
        if (!message) return { slug, previewString: null };
        const profile = await ctx.db.get(message.profile);
        if (!profile) return { slug, previewString: null };
        const messageContent = getMessageContent(message.snapshots);
        const messageContentString =
          messageContent === null ? "Preview unavailable" : messageContent;
        const displayName = profile.name;
        const previewString = `${displayName}: ${messageContentString}`;
        return {
          slug,
          previewString,
        };
      }),
    );
    return messages;
  },
});

export const markAsRead = authedMutation({
  args: {
    messageIds: v.array(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const myProfile = await getProfileByUserId(ctx, ctx.user.subject);
    for (const messageId of args.messageIds) {
      const message = await ctx.db.get(messageId);
      if (!message) continue;
      if (message.seenBy.some((viewer) => viewer.profile === myProfile._id))
        continue;
      if (message.profile === myProfile._id) continue;
      await ctx.db.patch(messageId, {
        seenBy: [
          ...message.seenBy,
          { profile: myProfile._id, timestamp: Date.now() },
        ],
      });
    }
  },
});

export const toggleReaction = authedMutation({
  args: {
    messageId: v.id("messages"),
    emoji: vReactionEmoji,
  },
  handler: async (ctx, args) => {
    const rateLimiterResponse = await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
    });
    if (rateLimiterResponse.ok === false) {
      throw new ConvexError(
        `Slow down! You're reacting to messages too fast. Try again in a few seconds.`,
      );
    }
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError("Message not found");
    const profile = await getProfileByUserId(ctx, ctx.user.subject);
    const iveReactedWithThisEmojiAlready = message.reactions.some(
      (r) => r.profile === profile._id && r.emoji === args.emoji,
    );
    if (iveReactedWithThisEmojiAlready) {
      await ctx.db.patch(args.messageId, {
        reactions: message.reactions.filter(
          (r) => !(r.profile === profile._id && r.emoji === args.emoji),
        ),
      });
    } else {
      await ctx.db.patch(args.messageId, {
        reactions: [
          ...message.reactions,
          { profile: profile._id, emoji: args.emoji },
        ],
      });
    }
  },
});
