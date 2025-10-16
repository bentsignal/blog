import { useState } from "react";
import * as ComposerContext from "@/context/composer-context";
import { MessageContext, useMessage } from "@/context/message-context";
import { validateMessage } from "@/utils/message-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import * as Composer from "@/ui/atoms/composer";
import { ButtonGroup } from "@/ui/external/button-group";
import { useMessageActions } from "@/hooks/use-message-actions";

export const EditComposer = () => {
  const hasParentContext = useHasParentContext(MessageContext);
  if (!hasParentContext) {
    throw new Error("MessageContext not found");
  }

  const messageId = useMessage((c) => c._id);
  const inputRef = useMessage((c) => c.editComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const previousContent = useMessage(
    (c) => c.snapshots[c.snapshots.length - 1].content,
  );

  const [inputValue, setInputValue] = useState(previousContent);

  const { editMessage } = useMessageActions();

  return (
    <ComposerContext.Provider
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
        if (previousContent !== newValue) {
          editMessage({
            messageId: messageId,
            content: newValue,
          });
        }
        setInteractionState("idle");
      }}
      onCancel={() => {
        setInteractionState("idle");
      }}
    >
      <Composer.Frame className="my-3 rounded-none px-6">
        <Composer.Input placeholder={previousContent} />
        <ButtonGroup>
          <Composer.Cancel />
          <Composer.Save />
        </ButtonGroup>
      </Composer.Frame>
    </ComposerContext.Provider>
  );
};
