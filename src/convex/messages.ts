import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { MutationCtx, query } from "./_generated/server";
import { authedMutation } from "./convex_helpers";
import { rateLimiter } from "./limiter";
import { getFileURL } from "./uploadthing";
import { getProfile, type Profile } from "./user";

const validateMessage = (content: string) => {
  if (!content) throw new ConvexError("Content is required");
  if (content.length > 1000) throw new ConvexError("Content is too long");
  if (content.length < 1) throw new ConvexError("Content is too short");
};

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .order("desc")
      .paginate(args.paginationOpts);
    const allProfiles = messages.page.map((message) => message.profile);
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
      page: messages.page.map((message) => {
        const user = profilesMap[message.profile];
        if (!user) throw new ConvexError("User not found");
        const { profile: _, ...publicMessage } = message;
        return {
          ...publicMessage,
          name: user.name,
          pfp: user.image,
        };
      }),
    };
  },
});

export const send = authedMutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { content } = args;
    validateMessage(content);
    // will throw a ConvexError if the rate limit is exceeded
    await rateLimiter.limit(ctx, "sendMessage", {
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
    });
  },
});

export const deleteMessagesFromUser = async (
  ctx: MutationCtx,
  userId: string,
) => {
  const profile = await getProfile(ctx, userId);
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("profile"), profile._id))
    .collect();
  for (const message of messages) {
    await ctx.db.delete(message._id);
  }
};
