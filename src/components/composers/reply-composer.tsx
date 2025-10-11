"use client";

import { useState } from "react";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import { MessageContext, useMessage } from "../messages/message";
import { ButtonGroup } from "../ui/button-group";
import * as Composer from "./composer";
import { validateMessage } from "@/lib/utils";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ReplyComposer = () => {
  const hasMessageContext = useHasParentContext(MessageContext);
  if (!hasMessageContext) {
    throw new Error("MessageContext not found");
  }

  const messageId = useMessage((c) => c._id);
  const channel = useMessage((c) => c.channel);
  const inputRef = useMessage((c) => c.replyComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const setIsHovering = useMessage((c) => c.setIsHovering);
  const name = useMessage((c) => c.name);

  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useMessageActions();

  return (
    <Composer.Provider
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
      onSubmit={() => {
        const newValue = inputRef.current?.value ?? "";
        const validation = validateMessage(newValue);
        if (validation !== "Valid") {
          toast.error(validation);
          return;
        }
        sendMessage({
          content: newValue,
          channel: channel,
          replyTo: messageId,
        });
        setInputValue("");
        setInteractionState("idle");
        setIsHovering(false);
      }}
      onCancel={() => {
        setIsHovering(false);
        setInteractionState("idle");
      }}
    >
      <Composer.InlineHeader>
        Replying to <span className="font-semibold">{name}</span>
      </Composer.InlineHeader>
      <Composer.Frame className="mb-3 rounded-none px-6">
        <Composer.Input />
        <ButtonGroup>
          <Composer.Cancel />
          <Composer.Send />
        </ButtonGroup>
      </Composer.Frame>
    </Composer.Provider>
  );
};
