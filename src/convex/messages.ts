import { MessageDataWithUserInfo } from "@/types/message-types";
import { validateMessage } from "@/utils/message-utils";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { MutationCtx, query } from "./_generated/server";
import { authedMutation } from "./convex_helpers";
import { rateLimiter } from "./limiter";
import { getFileURL } from "./uploadthing";
import { getProfile, type Profile } from "./user";

export const get = query({
  args: {
    channel: v.id("channels"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channel", args.channel))
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
        let reply: MessageDataWithUserInfo | undefined;
        if (repliedToMessage) {
          const profile = profilesMap[repliedToMessage.profile];
          if (!profile) throw new ConvexError("User not found");
          reply = {
            ...repliedToMessage,
            name: profile.name,
            pfp: profile.image,
          };
        }

        return {
          ...message,
          name: user.name,
          pfp: user.image,
          reply,
        };
      }),
    };
  },
});

export const send = authedMutation({
  args: {
    content: v.string(),
    channel: v.id("channels"),
    replyTo: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const { content } = args;
    const validation = validateMessage(content);
    if (validation !== "Valid") throw new ConvexError(validation);
    // will throw a ConvexError if the rate limit is exceeded
    await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
      throws: true,
    });
    const profile = await getProfile(ctx, ctx.user.subject);
    await ctx.db.insert("messages", {
      snapshots: [
        {
          content,
          timestamp: Date.now(),
        },
      ],
      profile: profile._id,
      channel: args.channel,
      replyTo: args.replyTo,
    });
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
    // will throw a ConvexError if the rate limit is exceeded
    await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
      throws: true,
    });
    const userId = ctx.user.subject;
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError("Message not found");
    const profile = await getProfile(ctx, userId);
    if (message.profile !== profile._id) throw new ConvexError("Unauthorized");
    await ctx.db.patch(args.messageId, {
      snapshots: [
        ...message.snapshots,
        {
          content: args.content,
          timestamp: Date.now(),
        },
      ],
    });
  },
});

export const deleteOne = authedMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    // will throw a ConvexError if the rate limit is exceeded
    await rateLimiter.limit(ctx, "messageAction", {
      key: ctx.user.subject,
      throws: true,
    });
    const userId = ctx.user.subject;
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new ConvexError("Message not found");
    const profile = await getProfile(ctx, userId);
    if (message.profile !== profile._id) throw new ConvexError("Unauthorized");
    await ctx.db.delete(args.messageId);
  },
});

export const deleteAllFromUser = async (ctx: MutationCtx, userId: string) => {
  const profile = await getProfile(ctx, userId);
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("profile"), profile._id))
    .collect();
  for (const message of messages) {
    await ctx.db.delete(message._id);
  }
};
