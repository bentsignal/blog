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
  const setEditInProgress = useMessage((c) => c.setEditInProgress);
  const setIsHovering = useMessage((c) => c.setIsHovering);
  const { editMessage } = useMessageActions();

  const [inputValue, setInputValue] = useState(
    snapshots[snapshots.length - 1].content,
  );

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
        const previousContent = snapshots[snapshots.length - 1].content;
        if (previousContent !== newValue) {
          editMessage({
            messageId: messageId,
            content: newValue,
          });
        }
        setEditInProgress(false);
        setIsHovering(false);
      }}
      onCancel={() => {
        setIsHovering(false);
        setEditInProgress(false);
      }}
    >
      <Composer.Frame className="my-3 rounded-none px-6">
        <Composer.Header />
        <Composer.Input />
        <Composer.Footer>
          <Composer.CommonActions />
          <ButtonGroup>
            <Composer.Cancel />
            <Composer.Save />
          </ButtonGroup>
        </Composer.Footer>
      </Composer.Frame>
    </Composer.Provider>
  );
};
