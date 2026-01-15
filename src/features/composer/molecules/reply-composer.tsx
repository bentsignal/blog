import { useState } from "react";
import { toast } from "sonner";
import * as Chat from "@/features/chat/atom";
import * as Composer from "@/features/composer/atom";
import * as Message from "@/features/messages/atom";
import { useMessageActions } from "@/features/messages/hooks/use-message-actions";
import { validateMessage } from "@/features/messages/utils";
import * as ButtonGroup from "@/atoms/button-group";
import * as Scroll from "@/atoms/scroll";

const ReplyComposer = () => {
  const messageId = Message.useStore((s) => s._id);
  const inputRef = Message.useStore((s) => s.replyComposerInputRef);
  const setInteractionState = Message.useStore((s) => s.setInteractionState);
  const name = Message.useStore((s) => s.name);
  const slug = Message.useStore((s) => s.slug);

  const scrollToBottom = Scroll.useStore((s) => s.scrollToBottom, {
    optional: true,
  });
  const chatWindowComposer = Chat.useStore((s) => s.composerInputRef);

  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useMessageActions();

  return (
    <Composer.Store
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
          scrollToBottom?.();
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
    </Composer.Store>
  );
};

export { ReplyComposer };
