import { useState } from "react";
import {
  ChatWindowContext,
  useChatWindow,
} from "@/context/chat-window-context";
import { validateMessage } from "@/utils/message-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as ButtonGroup from "@/atoms/button-group";
import * as Composer from "@/atoms/composer";
import { MessageContext, useMessage } from "@/atoms/message";
import { ScrollContext, useScroll } from "@/atoms/scroll";
import { useRequiredContext } from "@/lib/context";
import { useMessageActions } from "@/hooks/use-message-actions";

export const ReplyComposer = () => {
  useRequiredContext([MessageContext, ChatWindowContext]);
  const hasScrollContext = useHasParentContext(ScrollContext);

  const messageId = useMessage((c) => c._id);
  const inputRef = useMessage((c) => c.replyComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const name = useMessage((c) => c.name);
  const slug = useMessage((c) => c.slug);

  const scrollToBottom = useScroll((c) => c.scrollToBottom);
  const chatWindowComposer = useChatWindow((c) => c.composerInputRef);

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
      <Composer.Frame className="mb-3 rounded-none px-6">
        <Composer.Input />
        <ButtonGroup.Frame>
          <Composer.Cancel />
          <Composer.Send />
        </ButtonGroup.Frame>
      </Composer.Frame>
    </Composer.Provider>
  );
};
