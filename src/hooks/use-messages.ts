import { create } from "zustand";
import { Message } from "@/components/messages/message";

const STARTING_MESSAGES: Message[] = [
  {
    id: 1,
    user: "Shawn",
    content:
      "Hello, how are you? This is a longer message to test the layout. I'm not sure how long it will be. But let's see how it looks.",
    createdAt: new Date(),
  },
];

interface MessagesStore {
  messages: Message[];
  sendMessage: (message: Message) => void;
}

export const useMessages = create<MessagesStore>((set) => ({
  messages: STARTING_MESSAGES,
  sendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));
