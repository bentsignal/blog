import { Doc } from "@/convex/_generated/dataModel";
import { Infer, v } from "convex/values";

export interface EnhancedMessage extends Doc<"messages"> {
  name: string;
  pfp: string | null | undefined;
  reply?: EnhancedMessage;
  content: string | null;
  reactionSignature: string;
}

export type MessageInteractionState = "idle" | "editing" | "replying";

export const vSnapshot = v.object({
  content: v.string(),
  timestamp: v.number(),
});

export type Snapshot = Infer<typeof vSnapshot>;

export const REACTION_EMOJIS = ["❤️", "😂", "👍", "👎"] as const;
export const vReactionEmoji = v.union(
  ...REACTION_EMOJIS.map((emoji) => v.literal(emoji)),
);
export type ReactionEmoji = Infer<typeof vReactionEmoji>;

export const vReaction = v.object({
  profile: v.id("profiles"),
  emoji: vReactionEmoji,
});

export type Reaction = Infer<typeof vReaction>;
