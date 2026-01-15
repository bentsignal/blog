import { useState } from "react";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as Auth from "@/features/auth/atom";
import * as Channel from "@/features/channel/atom";
import * as Chat from "@/features/chat/atom";
import * as Composer from "@/features/composer/atom";
import { useMessageActions } from "@/features/messages/hooks/use-message-actions";
import { validateMessage } from "@/features/messages/utils";
import * as Scroll from "@/atoms/scroll";

const ChannelComposer = () => {
  const [inputValue, setInputValue] = useState("");

  const slug = Channel.useStore((s) => s.slug);
  const composerInputRef = Chat.useStore((s) => s.composerInputRef);
  const imNotSignedIn = Auth.useStore((s) => !s.imSignedIn);
  const signIn = Auth.useStore((s) => s.signIn);
  const scrollToBottom = Scroll.useStore((s) => s.scrollToBottom, {
    optional: true,
  });

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
      scrollToBottom?.();
    }, 0);
  };

  return (
    <Composer.Store
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={composerInputRef}
    >
      <Composer.Container className="mx-4 mb-4">
        <Composer.Input className="ml-1" />
        <Composer.Send />
      </Composer.Container>
    </Composer.Store>
  );
};

export { ChannelComposer };
