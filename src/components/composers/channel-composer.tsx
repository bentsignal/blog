"use client";

import { useRef, useState } from "react";
import { ChannelContext, useChannel } from "@/providers/channel-provider";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import { useAuth } from "../auth";
import * as Composer from "./composer";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ChannelComposer = () => {
  const hasChannelContext = useHasParentContext(ChannelContext);
  if (!hasChannelContext) {
    throw new Error("ChannelContext not found");
  }

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const channel = useChannel((c) => c.channel);
  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);

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
    setInputValue("");
    sendMessage({
      content: value,
      channel: channel._id,
    });
  };

  return (
    <Composer.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={inputRef}
    >
      <Composer.Frame className="mx-4 mb-4">
        <Composer.Header />
        <Composer.Input />
        <Composer.Footer>
          <Composer.CommonActions />
          <Composer.Send />
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Provider>
  );
};
