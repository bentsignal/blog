"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Auth from "@/features/auth/atom";
import * as Chat from "@/features/chat/atom";
import type {
  EnhancedMessage,
  MessageInteractionState,
} from "@/features/messages/types";
import { createContext, useRequiredContext } from "@/lib/context";

interface MessageContextType extends EnhancedMessage {
  interactionState: MessageInteractionState;
  setInteractionState: (interactionState: MessageInteractionState) => void;
  editComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  replyComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

const { Context, useContext } = createContext<MessageContextType>({
  displayName: "MessageContext",
});

const Provider = ({
  message,
  children,
}: {
  message: EnhancedMessage;
  children: React.ReactNode;
}) => {
  useRequiredContext(Auth.Context);
  useRequiredContext(Chat.Context);

  const [isHovered, setIsHovered] = useState(false);
  const [interactionState, setInteractionState] =
    useState<MessageInteractionState>("idle");

  const editComposerInputRef = useRef<HTMLTextAreaElement>(null);
  const replyComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const myProfileId = Auth.useContext((c) => c.myProfileId);
  const imNotSignedIn = Auth.useContext((c) => !c.imSignedIn);

  const frameRef = useRef<HTMLDivElement>(null);

  // determine if user has seen message
  const observerRef = useRef<IntersectionObserver | null>(null);
  const iJustRead = Chat.useContext((c) => c.iJustRead);
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
      username: message.username,
      content: message.content,
      snapshots: message.snapshots,
      reply: message.reply,
      slug: message.slug,
      seenBy: message.seenBy,
      reactions: message.reactions,
      reactionSignature: message.reactionSignature,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
      frameRef,
      isHovered,
      setIsHovered,
    }),
    [
      message._id,
      message._creationTime,
      message.profile,
      message.name,
      message.pfp,
      message.username,
      message.snapshots,
      message.reply,
      message.slug,
      message.seenBy,
      message.reactions,
      message.reactionSignature,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
      message.content,
      isHovered,
      setIsHovered,
    ],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
