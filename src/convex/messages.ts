import { ConvexError, v } from "convex/values";
import { internalMutation, MutationCtx, query } from "./_generated/server";
import { authComponent } from "./auth";
import { authedMutation } from "./convex_helpers";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    const messagesWithUserData = await Promise.all(
      messages.map(async (message) => {
        const user = await authComponent.getAnyUserById(ctx, message.user);
        if (!user) throw new ConvexError("User not found");
        const { user: _, ...publicMessage } = message;
        return {
          ...publicMessage,
          username: user.username,
          pfp: user.image,
        };
      }),
    );
    return messagesWithUserData;
    return [];
  },
});

export const sendMessage = authedMutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { content } = args;
    validateMessage(content);
    const user = await authComponent.getAuthUser(ctx);
    await ctx.db.insert("messages", {
      content,
      user: user._id,
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
