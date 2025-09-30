import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { authedMutation } from "./convex_helpers";

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    // const messages = await ctx.db.query("messages").collect();
    // const messagesWithUserData = await Promise.all(
    //   messages.map(async (message) => {
    //     const user = await ctx.db.get(message.user);
    //     if (!user) throw new ConvexError("User not found");
    //     const { user: _, ...publicMessage } = message;
    //     return {
    //       ...publicMessage,
    //       username: user.username,
    //       pfp: user.pfp,
    //     };
    //   }),
    // );
    // return messagesWithUserData;
    return [];
  },
});

export const sendMessage = authedMutation({
  args: {
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // const { content } = args;
    // validateMessage(content);
    // const userId = ctx.user.subject;
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_user_id", (q) => q.eq("userId", userId))
    //   .unique();
    // if (!user) throw new ConvexError("User not found");
    // return await ctx.db.insert("messages", {
    //   content,
    //   user: user._id,
    // });
    return true;
  },
});

const validateMessage = (content: string) => {
  if (!content) throw new ConvexError("Content is required");
  if (content.length > 1000) throw new ConvexError("Content is too long");
  if (content.length < 1) throw new ConvexError("Content is too short");
};
