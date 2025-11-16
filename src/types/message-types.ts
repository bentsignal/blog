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
