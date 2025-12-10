import { useState } from "react";
import * as Composer from "@/features/composer/atom";
import * as Message from "@/features/messages/atom";
import { useMessageActions } from "@/features/messages/hooks";
import { validateMessage } from "@/features/messages/utils";
import { toast } from "sonner";
import * as ButtonGroup from "@/atoms/button-group";
import { useRequiredContext } from "@/lib/context";

const EditComposer = () => {
  useRequiredContext(Message.Context);

  const messageId = Message.useContext((c) => c._id);
  const inputRef = Message.useContext((c) => c.editComposerInputRef);
  const setInteractionState = Message.useContext((c) => c.setInteractionState);
  const previousContent = Message.useContext(
    (c) => c.snapshots[c.snapshots.length - 1].content,
  );

  const [inputValue, setInputValue] = useState(previousContent);

  const { editMessage } = useMessageActions();

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
    </Composer.Provider>
  );
};

export { EditComposer };
