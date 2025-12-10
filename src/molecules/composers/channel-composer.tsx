import { useState } from "react";
import {
  ChatWindowContext,
  useChatWindow,
} from "@/context/chat-window-context";
import * as Auth from "@/features/auth/atom";
import { validateMessage } from "@/utils/message-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as Composer from "@/atoms/composer";
import * as Scroll from "@/atoms/scroll";
import { ChannelContext, useChannel } from "@/molecules/channel-page";
import { useRequiredContext } from "@/lib/context";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ChannelComposer = () => {
  useRequiredContext(ChannelContext);
  useRequiredContext(ChatWindowContext);
  useRequiredContext(Auth.Context);

  const hasScrollContext = useHasParentContext(Scroll.Context);

  const [inputValue, setInputValue] = useState("");

  const slug = useChannel((c) => c.slug);
  const composerInputRef = useChatWindow((c) => c.composerInputRef);
  const imNotSignedIn = Auth.useContext((c) => !c.imSignedIn);
  const signIn = Auth.useContext((c) => c.signIn);
  const scrollToBottom = Scroll.useContext((c) => c.scrollToBottom);

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
      if (hasScrollContext) scrollToBottom();
    }, 0);
  };

  return (
    <Composer.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={composerInputRef}
    >
      <Composer.Container className="mx-4 mb-4">
        <Composer.Input className="ml-1" />
        <Composer.Send />
      </Composer.Container>
    </Composer.Provider>
  );
};
