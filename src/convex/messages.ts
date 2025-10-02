import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { MutationCtx, query } from "./_generated/server";
import { authedMutation } from "./convex_helpers";

type Profile = {
  name: string;
  image: string | null | undefined;
};

export const getMessages = query({
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
          image: data.image,
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
        const { user: _, ...publicMessage } = message;
        return {
          ...publicMessage,
          name: user.name,
          pfp: user.image,
        };
      }),
    };
  },
});

export const sendMessage = authedMutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { content } = args;
    validateMessage(content);
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("user", ctx.user.subject))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    await ctx.db.insert("messages", {
      content,
      user: ctx.user.subject,
      profile: profile._id,
    });
  },
});

const validateMessage = (content: string) => {
  if (!content) throw new ConvexError("Content is required");
  if (content.length > 1000) throw new ConvexError("Content is too long");
  if (content.length < 1) throw new ConvexError("Content is too short");
};

export const deleteMessagesFromUser = async (
  ctx: MutationCtx,
  userId: string,
) => {
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("user"), userId))
    .collect();
  for (const message of messages) {
    await ctx.db.delete(message._id);
  }
};
