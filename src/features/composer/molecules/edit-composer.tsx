import { useState } from "react";
import { toast } from "sonner";
import * as Composer from "@/features/composer/atom";
import * as Message from "@/features/messages/atom";
import { useMessageActions } from "@/features/messages/hooks/use-message-actions";
import { validateMessage } from "@/features/messages/utils";
import * as ButtonGroup from "@/atoms/button-group";

const EditComposer = () => {
  const messageId = Message.useStore((s) => s._id);
  const inputRef = Message.useStore((s) => s.editComposerInputRef);
  const setInteractionState = Message.useStore((s) => s.setInteractionState);
  const previousContent = Message.useStore(
    (s) => s.snapshots[s.snapshots.length - 1].content,
  );

  const [inputValue, setInputValue] = useState(previousContent);

  const { editMessage } = useMessageActions();

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
      <Composer.Container className="my-3 rounded-none px-6">
        <Composer.Input placeholder={previousContent} />
        <ButtonGroup.Frame>
          <Composer.Cancel />
          <Composer.Save />
        </ButtonGroup.Frame>
      </Composer.Container>
    </Composer.Store>
  );
};

export { EditComposer };
