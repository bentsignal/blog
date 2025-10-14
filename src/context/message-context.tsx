"use client";

import { useMemo, useRef, useState } from "react";
import {
  MessageDataWithUserInfo,
  MessageInteractionState,
} from "@/types/message-types";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";

interface MessageContextType extends MessageDataWithUserInfo {
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
  interactionState: MessageInteractionState;
  setInteractionState: (interactionState: MessageInteractionState) => void;
  editComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
  replyComposerInputRef: React.RefObject<HTMLTextAreaElement | null>;
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
  const [isHovering, setIsHovering] = useState(false);
  const editComposerInputRef = useRef<HTMLTextAreaElement>(null);
  const [interactionState, setInteractionState] =
    useState<MessageInteractionState>("idle");
  const replyComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      profile: message.profile,
      name: message.name,
      pfp: message.pfp,
      snapshots: message.snapshots,
      channel: message.channel,
      reply: message.reply,
      isHovering,
      setIsHovering,
      editComposerInputRef,
      replyComposerInputRef,
      interactionState,
      setInteractionState,
    }),
    [message, isHovering, setIsHovering, interactionState, setInteractionState],
  );

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};
