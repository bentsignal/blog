import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { authedMutation } from "./convex_helpers";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    if (!auth) throw new ConvexError("Unauthorized");
    return await ctx.db.query("messages").collect();
  },
});

export const sendMessage = authedMutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const { content } = args;
    validateMessage(content);
    return await ctx.db.insert("messages", {
      content,
    });
  },
});

const validateMessage = (content: string) => {
  if (!content) throw new ConvexError("Content is required");
  if (content.length > 1000) throw new ConvexError("Content is too long");
  if (content.length < 1) throw new ConvexError("Content is too short");
};
