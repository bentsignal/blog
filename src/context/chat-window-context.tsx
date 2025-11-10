"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { type ChannelSlug } from "@/data/channels";
import { validateChannelSlug } from "@/utils/slug-utils";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { useAuth } from "./auth-context";
import { useMessageActions } from "@/hooks/use-message-actions";

interface ChatWindowContextType {
  currentChannelSlug?: ChannelSlug;
  setCurrentChannelSlug: (slug?: ChannelSlug) => void;
  composerInputRef: RefObject<HTMLTextAreaElement | null>;
  iJustRead: (messageId: Id<"messages">) => void;
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
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  const { markAsRead } = useMessageActions();
  const imNotSignedIn = useAuth((c) => !c.imSignedIn);

  // periodically check if the user has read new messages, if so mark them as read
  const intervalTime = 1000 * 5; // check every 5 seconds
  const messageIdsAlreadyMarkedAsRead = useRef<Set<Id<"messages">>>(new Set());
  const messageIdsToMarkAsRead = useRef<Set<Id<"messages">>>(new Set());
  useEffect(() => {
    if (imNotSignedIn) return;
    const interval = setInterval(() => {
      const newMessageIdsToMarkAsRead = Array.from(
        messageIdsToMarkAsRead.current,
      );
      if (newMessageIdsToMarkAsRead.length === 0) return;
      markAsRead({ messageIds: newMessageIdsToMarkAsRead });
      for (const messageId of newMessageIdsToMarkAsRead) {
        messageIdsAlreadyMarkedAsRead.current.add(messageId);
      }
      messageIdsToMarkAsRead.current.clear();
    }, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime, markAsRead, imNotSignedIn]);

  const iJustRead = useCallback(
    (messageId: Id<"messages">) => {
      if (messageIdsAlreadyMarkedAsRead.current.has(messageId)) {
        return;
      }
      messageIdsToMarkAsRead.current.add(messageId);
    },
    [messageIdsAlreadyMarkedAsRead],
  );

  const contextValue = {
    currentChannelSlug,
    setCurrentChannelSlug,
    composerInputRef,
    iJustRead,
  };

  return (
    <ChatWindowContext.Provider value={contextValue}>
      {children}
    </ChatWindowContext.Provider>
  );
};
