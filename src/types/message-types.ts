import { Doc } from "@/convex/_generated/dataModel";
import { Infer, v } from "convex/values";

export interface MessageDataWithUserInfo extends Doc<"messages"> {
  name: string;
  pfp: string | null | undefined;
  reply?: MessageDataWithUserInfo;
  content: string | null;
}

export type MessageInteractionState = "idle" | "editing" | "replying";

export const vSnapshot = v.object({
  content: v.string(),
  timestamp: v.number(),
});

export type Snapshot = Infer<typeof vSnapshot>;

export const EMOJIS = ["❤️", "😂", "👍", "👎"] as const;
export const vEmoji = v.union(...EMOJIS.map((emoji) => v.literal(emoji)));
export type Emoji = Infer<typeof vEmoji>;

export const vReaction = v.object({
  profile: v.id("profiles"),
  emoji: vEmoji,
});

export type Reaction = Infer<typeof vReaction>;
