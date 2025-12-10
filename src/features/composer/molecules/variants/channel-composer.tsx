import { useState } from "react";
import * as Auth from "@/features/auth/atom";
import * as Channel from "@/features/channel/atom";
import * as Chat from "@/features/chat/atom";
import * as Composer from "@/features/composer/atom";
import { useMessageActions } from "@/features/messages/hooks";
import { validateMessage } from "@/features/messages/utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as Scroll from "@/atoms/scroll";
import { useRequiredContext } from "@/lib/context";

const ChannelComposer = () => {
  useRequiredContext(Channel.Context);
  useRequiredContext(Chat.Context);
  useRequiredContext(Auth.Context);

  const hasScrollContext = useHasParentContext(Scroll.Context);

  const [inputValue, setInputValue] = useState("");

  const slug = Channel.useContext((c) => c.slug);
  const composerInputRef = Chat.useContext((c) => c.composerInputRef);
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

export { ChannelComposer };
