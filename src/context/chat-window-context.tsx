"use client";

import { useState } from "react";
import { type ChannelSlug } from "@/data/channels";
import { validateChannelSlug } from "@/utils/slug-utils";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

interface ChatWindowContextType {
  currentChannelSlug?: ChannelSlug;
  setCurrentChannelSlug: (slug?: ChannelSlug) => void;
}

export const ChatWindowContext = createContext<ChatWindowContextType>(
  {} as ChatWindowContextType,
);

export const useChatWindow = <T,>(
  selector: ContextSelector<ChatWindowContextType, T>,
) => useContextSelector(ChatWindowContext, selector);

export const Provider = ({
  slugFromHeaders,
  children,
}: {
  slugFromHeaders: string | null;
  children: React.ReactNode;
}) => {
  const validatedSlug = validateChannelSlug(slugFromHeaders);
  const [currentChannelSlug, setCurrentChannelSlug] = useState(validatedSlug);

  const contextValue = {
    currentChannelSlug,
    setCurrentChannelSlug,
  };

  return (
    <ChatWindowContext.Provider value={contextValue}>
      {children}
    </ChatWindowContext.Provider>
  );
};
