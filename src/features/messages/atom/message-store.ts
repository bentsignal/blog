"use client";

import { useEffect, useRef, useState } from "react";
import { createStore } from "rostra";
import type {
  EnhancedMessage,
  MessageInteractionState,
} from "@/features/messages/types";
import * as Auth from "@/features/auth/atom";
import * as Chat from "@/features/chat/atom";

interface StoreType extends EnhancedMessage {
  interactionState: MessageInteractionState;
  setInteractionState: (interactionState: MessageInteractionState) => void;
  editComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  replyComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

interface StoreProps {
  message: EnhancedMessage;
}

function useInternalStore({ message }: StoreProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [interactionState, setInteractionState] =
    useState<MessageInteractionState>("idle");

  const editComposerInputRef = useRef<HTMLTextAreaElement>(null);
  const replyComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const myProfileId = Auth.useStore((s) => s.myProfileId);
  const imNotSignedIn = Auth.useStore((s) => !s.imSignedIn);

  const frameRef = useRef<HTMLDivElement>(null);

  // determine if user has seen message
  const observerRef = useRef<IntersectionObserver | null>(null);
  const iJustRead = Chat.useStore((s) => s.iJustRead);
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

  return {
    ...message,
    editComposerInputRef,
    replyComposerInputRef,
    interactionState,
    setInteractionState,
    frameRef,
    isHovered,
    setIsHovered,
  };
}

export const { Store, useStore } = createStore<StoreType, StoreProps>(
  useInternalStore,
);
