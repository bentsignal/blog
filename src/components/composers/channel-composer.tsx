"use client";

import { useState } from "react";
import { ChannelContext, useChannel } from "@/providers/channel-provider";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import { useAuth } from "../auth";
import { ListContext, useList } from "../list";
import * as Composer from "./composer";
import { validateMessage } from "@/lib/utils";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ChannelComposer = ({
  inputRef,
}: {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}) => {
  const hasChannelContext = useHasParentContext(ChannelContext);
  const hasListContext = useHasParentContext(ListContext);

  if (!hasChannelContext) {
    throw new Error("ChannelContext not found");
  }
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const [inputValue, setInputValue] = useState("");

  const channel = useChannel((c) => c.channel);
  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);

  const scrollToBottom = useList((c) => c.scrollToBottom);

  const { sendMessage } = useMessageActions();

  const onSubmit = async () => {
    if (!signedIn) {
      await signIn();
      return;
    }
    if (!channel) {
      toast.error("Channel not found");
      return;
    }
    const value = inputRef.current?.value ?? "";
    const validation = validateMessage(value);
    if (validation !== "Valid") {
      toast.error(validation);
      return;
    }
    setInputValue("");
    sendMessage({
      content: value,
      channel: channel._id,
    });
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  return (
    <Composer.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
    >
      <Composer.Frame className="mx-4 mb-4">
        <Composer.Input className="ml-1" />
        <Composer.Send />
      </Composer.Frame>
    </Composer.Provider>
  );
};
