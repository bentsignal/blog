import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ChannelContext, useChannel } from "@/context/channel-context";
import * as ComposerContext from "@/context/composer-context";
import { ListContext, useList } from "@/context/list-context";
import { validateMessage } from "@/utils/message-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as Composer from "@/ui/atoms/composer";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ChannelComposer = () => {
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
  const composerInputRef = useChannel((c) => c.channelComposerInputRef);
  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);
  const scrollToBottom = useList((c) => c.scrollToBottom);

  const { sendMessage } = useMessageActions();

  const onSubmit = async () => {
    if (!signedIn) {
      await signIn();
      return;
    }
    const value = composerInputRef.current?.value ?? "";
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
    if (composerInputRef.current) {
      composerInputRef.current.style.height = "auto";
    }
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  return (
    <ComposerContext.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={composerInputRef}
    >
      <Composer.Frame className="mx-4 mb-4">
        <Composer.Input className="ml-1" />
        <Composer.Send />
      </Composer.Frame>
    </ComposerContext.Provider>
  );
};
