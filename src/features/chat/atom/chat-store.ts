"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createStore } from "rostra";
import { Id } from "@/convex/_generated/dataModel";
import { findChannelWithSlug } from "@/utils/slug-utils";
import * as Auth from "@/features/auth/atom";
import { useMessageActions } from "@/features/messages/hooks/use-message-actions";

type StoreProps = {
  slugFromHeaders: string | null;
};

function useInternalStore({ slugFromHeaders }: StoreProps) {
  const validatedSlug = findChannelWithSlug(slugFromHeaders);
  const [currentChannelSlug, setCurrentChannelSlug] = useState(validatedSlug);
  const composerInputRef = useRef<HTMLTextAreaElement>(null);

  const { markAsRead } = useMessageActions();
  const imNotSignedIn = Auth.useStore((s) => !s.imSignedIn);

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

  return {
    currentChannelSlug,
    setCurrentChannelSlug,
    composerInputRef,
    iJustRead,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
