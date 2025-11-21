import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { ChannelContext, useChannel } from "@/context/channel-context";
import { useChatWindow } from "@/context/chat-window-context";
import { Provider as ComposerProvider } from "@/context/composer-context";
import { ListContext, useList } from "@/context/list-context";
import { validateMessage } from "@/utils/message-utils";
import { toast } from "sonner";
import * as Composer from "@/ui/atoms/composer";
import { useMessageActions } from "@/hooks/use-message-actions";
import { useRequiredContext } from "@/hooks/use-required-context";

export const ChannelComposer = () => {
  useRequiredContext([ChannelContext, ListContext]);

  const [inputValue, setInputValue] = useState("");

  const slug = useChannel((c) => c.slug);
  const composerInputRef = useChatWindow((c) => c.composerInputRef);
  const imNotSignedIn = useAuth((c) => !c.imSignedIn);
  const signIn = useAuth((c) => c.signIn);
  const scrollToBottom = useList((c) => c.scrollToBottom);

  const { sendMessage } = useMessageActions();

  const onSubmit = async () => {
    if (imNotSignedIn) {
      await signIn();
      return;
    }
    const value = composerInputRef?.current?.value ?? "";
    const validation = validateMessage(value);
    if (validation !== "Valid") {
      toast.error(validation);
      return;
    }
    setInputValue("");
    sendMessage({
      content: value,
      slug,
    });
    if (composerInputRef?.current) {
      composerInputRef.current.style.height = "auto";
    }
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  return (
    <ComposerProvider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={composerInputRef}
    >
      <Composer.Frame className="mx-4 mb-4">
        <Composer.Input className="ml-1" />
        <Composer.Send />
      </Composer.Frame>
    </ComposerProvider>
  );
};
