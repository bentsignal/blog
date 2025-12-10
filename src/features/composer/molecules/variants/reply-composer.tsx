import { useState } from "react";
import * as Chat from "@/features/chat/atom";
import * as Composer from "@/features/composer/atom";
import * as Message from "@/features/messages/atom";
import { useMessageActions } from "@/features/messages/hooks";
import { validateMessage } from "@/features/messages/utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as ButtonGroup from "@/atoms/button-group";
import * as Scroll from "@/atoms/scroll";
import { useRequiredContext } from "@/lib/context";

const ReplyComposer = () => {
  useRequiredContext(Message.Context);
  useRequiredContext(Chat.Context);

  const hasScrollContext = useHasParentContext(Scroll.Context);

  const messageId = Message.use((c) => c._id);
  const inputRef = Message.use((c) => c.replyComposerInputRef);
  const setInteractionState = Message.use((c) => c.setInteractionState);
  const name = Message.use((c) => c.name);
  const slug = Message.use((c) => c.slug);

  const scrollToBottom = Scroll.use((c) => c.scrollToBottom);
  const chatWindowComposer = Chat.use((c) => c.composerInputRef);

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
          slug,
          replyTo: messageId,
        });
        setInteractionState("idle");
        chatWindowComposer?.current?.focus();
        setTimeout(() => {
          if (hasScrollContext) scrollToBottom();
        }, 0);
      }}
      onCancel={() => {
        setInteractionState("idle");
      }}
    >
      <Composer.InlineHeader>
        Replying to <span className="font-semibold">{name}</span>
      </Composer.InlineHeader>
      <Composer.Container className="mb-3 rounded-none px-6">
        <Composer.Input />
        <ButtonGroup.Frame>
          <Composer.Cancel />
          <Composer.Send />
        </ButtonGroup.Frame>
      </Composer.Container>
    </Composer.Provider>
  );
};

export { ReplyComposer };
