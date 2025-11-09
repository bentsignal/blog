import { Doc } from "@/convex/_generated/dataModel";

export interface MessageDataWithUserInfo extends Partial<Doc<"messages">> {
  name: string;
  pfp: string | null | undefined;
  reply?: Partial<MessageDataWithUserInfo>;
}

export type MessageInteractionState = "idle" | "editing" | "replying";
