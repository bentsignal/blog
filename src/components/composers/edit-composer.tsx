import { useState } from "react";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { toast } from "sonner";
import { MessageContext, useMessage } from "../messages/message";
import { ButtonGroup } from "../ui/button-group";
import * as Composer from "./composer";
import { validateMessage } from "@/lib/utils";
import { useMessageActions } from "@/hooks/use-message-actions";

export const EditComposer = () => {
  const hasParentContext = useHasParentContext(MessageContext);
  if (!hasParentContext) {
    throw new Error("MessageContext not found");
  }

  const snapshots = useMessage((c) => c.snapshots);
  const messageId = useMessage((c) => c._id);
  const inputRef = useMessage((c) => c.editComposerInputRef);
  const setInteractionState = useMessage((c) => c.setInteractionState);
  const setIsHovering = useMessage((c) => c.setIsHovering);
  const { editMessage } = useMessageActions();

  const [inputValue, setInputValue] = useState(
    snapshots[snapshots.length - 1].content,
  );

  const previousContent = snapshots[snapshots.length - 1].content;

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
        if (previousContent !== newValue) {
          editMessage({
            messageId: messageId,
            content: newValue,
          });
        }
        setInteractionState("idle");
        setIsHovering(false);
      }}
      onCancel={() => {
        setIsHovering(false);
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
    </Composer.Provider>
  );
};
