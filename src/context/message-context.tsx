"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageDataWithUserInfo,
  MessageInteractionState,
} from "@/types/message-types";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { useAuth } from "./auth-context";
import { useChatWindow } from "./chat-window-context";

interface MessageContextType extends MessageDataWithUserInfo {
  interactionState: MessageInteractionState;
  setInteractionState: (interactionState: MessageInteractionState) => void;
  editComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  replyComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageContext = createContext<MessageContextType>(
  {} as MessageContextType,
);

export const useMessage = <T,>(
  selector: ContextSelector<MessageContextType, T>,
) => useContextSelector(MessageContext, selector);

export const Provider = ({
  message,
  children,
}: {
  message: MessageDataWithUserInfo;
  children: React.ReactNode;
}) => {
  const [interactionState, setInteractionState] =
    useState<MessageInteractionState>("idle");

  const editComposerInputRef = useRef<HTMLTextAreaElement>(null);
  const replyComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const myProfileId = useAuth((c) => c.myProfileId);
  const imNotSignedIn = useAuth((c) => !c.imSignedIn);

  const frameRef = useRef<HTMLDivElement>(null);

  // determine if user has seen message
  const observerRef = useRef<IntersectionObserver | null>(null);
  const iJustRead = useChatWindow((c) => c.iJustRead);
  useEffect(() => {
    if (imNotSignedIn) return;

    const frame = frameRef.current;
    if (!frame) return;

    const iSentThisMessage = myProfileId === message.profile;
    if (iSentThisMessage) return;

    const iHaveAlreadySeenThisMessage = message.seenBy.some(
      (viewer) => viewer.profile === myProfileId,
    );
    if (iHaveAlreadySeenThisMessage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          iJustRead(message._id);
        }
      },
      { threshold: 0.1 },
    );
    observerRef.current = observer;
    observer.observe(frame);
    return () => observer.unobserve(frame);
  }, [myProfileId, message, iJustRead, imNotSignedIn]);

  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      profile: message.profile,
      name: message.name,
      pfp: message.pfp,
      content: message.content,
      snapshots: message.snapshots,
      reply: message.reply,
      slug: message.slug,
      seenBy: message.seenBy,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
      frameRef,
    }),
    [
      message._id,
      message._creationTime,
      message.profile,
      message.name,
      message.pfp,
      message.snapshots,
      message.reply,
      message.slug,
      message.seenBy,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
      message.content,
    ],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};
