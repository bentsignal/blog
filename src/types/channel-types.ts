import { Doc } from "@/convex/_generated/dataModel";

export interface ChannelDataWithMessagePreview extends Doc<"channels"> {
  messagePreview: string | null;
}
