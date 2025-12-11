"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import type { ChannelSlug } from "@/blog/channels";
import { Id } from "@/convex/_generated/dataModel";
import * as Auth from "@/features/auth/atom";
import { useMessageActions } from "@/features/messages/hooks/use-message-actions";
import { findChannelWithSlug } from "@/utils/slug-utils";
import { createContext, useRequiredContext } from "@/lib/context";

const { Context, useContext } = createContext<{
  currentChannelSlug?: ChannelSlug;
  setCurrentChannelSlug: (slug?: ChannelSlug) => void;
  composerInputRef: RefObject<HTMLTextAreaElement | null>;
  iJustRead: (messageId: Id<"messages">) => void;
}>({ displayName: "ChatWindowContext" });

const Provider = ({
  slugFromHeaders,
  children,
}: {
  slugFromHeaders: string | null;
  children: React.ReactNode;
}) => {
  useRequiredContext(Auth.Context);

  const validatedSlug = findChannelWithSlug(slugFromHeaders);
  const [currentChannelSlug, setCurrentChannelSlug] = useState(validatedSlug);
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  const { markAsRead } = useMessageActions();
  const imNotSignedIn = Auth.useContext((c) => !c.imSignedIn);

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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
