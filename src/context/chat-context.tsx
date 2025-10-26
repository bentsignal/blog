"use client";

import { useMemo, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

interface ChatContextType {
  currentChannel: Doc<"channels"> | null;
  setCurrentChannel: (channel: Doc<"channels"> | null) => void;
}

export const ChatContext = createContext<ChatContextType>({
  currentChannel: null,
  setCurrentChannel: () => {},
});

export const useChat = <T,>(selector: ContextSelector<ChatContextType, T>) =>
  useContextSelector(ChatContext, selector);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const [currentChannel, setCurrentChannel] = useState<Doc<"channels"> | null>(
    null,
  );
  const contextValue = useMemo(
    () => ({ currentChannel, setCurrentChannel }),
    [currentChannel, setCurrentChannel],
  );
  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
