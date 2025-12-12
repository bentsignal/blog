import { Infer, v } from "convex/values";
import { Doc } from "@/convex/_generated/dataModel";

interface EnhancedMessage extends Doc<"messages"> {
  name: string;
  username: string;
  pfp: string | null | undefined;
  reply?: EnhancedMessage;
  content: string | null;
  reactionSignature: string;
}

type MessageInteractionState = "idle" | "editing" | "replying";

const vSnapshot = v.object({
  content: v.string(),
  timestamp: v.number(),
});

type Snapshot = Infer<typeof vSnapshot>;

const REACTION_EMOJIS = ["❤️", "😂", "👍", "👎"] as const;
const vReactionEmoji = v.union(
  ...REACTION_EMOJIS.map((emoji) => v.literal(emoji)),
);
type ReactionEmoji = Infer<typeof vReactionEmoji>;

const vReaction = v.object({
  profile: v.id("profiles"),
  emoji: vReactionEmoji,
});

type Reaction = Infer<typeof vReaction>;

export type {
  EnhancedMessage,
  MessageInteractionState,
  Snapshot,
  Reaction,
  ReactionEmoji,
};
export { REACTION_EMOJIS, vSnapshot, vReactionEmoji, vReaction };
