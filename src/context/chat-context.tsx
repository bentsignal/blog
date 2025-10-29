"use client";

import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

interface ChatContextType {
  currentChannel?: Doc<"channels">;
  setCurrentChannel: (channel?: Doc<"channels">) => void;
}

export const ChatContext = createContext<ChatContextType>({
  currentChannel: undefined,
  setCurrentChannel: () => {},
});

export const useChat = <T,>(selector: ContextSelector<ChatContextType, T>) =>
  useContextSelector(ChatContext, selector);

export const Provider = ({
  channel,
  children,
}: {
  channel?: Doc<"channels">;
  children: React.ReactNode;
}) => {
  const [currentChannel, setCurrentChannel] = useState(channel);
  const contextValue = { currentChannel, setCurrentChannel };
  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
