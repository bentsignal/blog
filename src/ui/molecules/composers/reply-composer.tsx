import { useState } from "react";
import { useChannel } from "@/context/channel-context";
import { Provider as ComposerProvider } from "@/context/composer-context";
import { ListContext, useList } from "@/context/list-context";
import { MessageContext, useMessage } from "@/context/message-context";
import { validateMessage } from "@/utils/message-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as ButtonGroup from "@/ui/atoms/button-group";
import * as Composer from "@/ui/atoms/composer";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ReplyComposer = () => {
  const hasMessageContext = useHasParentContext(MessageContext);
  if (!hasMessageContext) {
    throw new Error("MessageContext not found");
  }

  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const messageId = useMessage((c) => c._id);
  const inputRef = useMessage((c) => c.replyComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const name = useMessage((c) => c.name);

  const slug = useChannel((c) => c.slug);

  const scrollToBottom = useList((c) => c.scrollToBottom);
  const listComposer = useList((c) => c.composerInputRef);

  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useMessageActions();

  return (
    <ComposerProvider
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
        listComposer?.current?.focus();
        setTimeout(() => {
          scrollToBottom();
        }, 0);
      }}
      onCancel={() => {
        setInteractionState("idle");
      }}
    >
      <Composer.InlineHeader>
        Replying to <span className="font-semibold">{name}</span>
      </Composer.InlineHeader>
      <Composer.Frame className="mb-3 rounded-none px-6">
        <Composer.Input />
        <ButtonGroup.Frame>
          <Composer.Cancel />
          <Composer.Send />
        </ButtonGroup.Frame>
      </Composer.Frame>
    </ComposerProvider>
  );
};
