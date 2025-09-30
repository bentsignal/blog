import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { MutationCtx, query } from "./_generated/server";
import { authComponent } from "./auth";
import { authedMutation } from "./convex_helpers";

type User = {
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
    const allUsers = messages.page.map((message) => message.user);
    const dedupedUsers = [...new Set(allUsers)];
    const usersData = await Promise.all(
      dedupedUsers.map((user) => authComponent.getAnyUserById(ctx, user)),
    );
    const usersMap = dedupedUsers.reduce(
      (acc, user, idx) => {
        const data = usersData[idx];
        if (!data) return acc;
        acc[user] = {
          name: data.name,
          image: data.image,
        };
        return acc;
      },
      {} as Record<string, User>,
    );
    return {
      ...messages,
      page: messages.page.map((message) => {
        const user = usersMap[message.user];
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
    await ctx.db.insert("messages", {
      content,
      user: ctx.user.subject,
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
