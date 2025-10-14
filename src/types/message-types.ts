import { Doc } from "@/convex/_generated/dataModel";

export interface MessageDataWithUserInfo extends Doc<"messages"> {
  name: string;
  pfp: string | null | undefined;
  reply?: MessageDataWithUserInfo;
}

export type MessageInteractionState = "idle" | "editing" | "replying";
