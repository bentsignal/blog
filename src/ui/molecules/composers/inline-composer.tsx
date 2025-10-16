import { MessageContext, useMessage } from "@/context/message-context";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { EditComposer, ReplyComposer } from "@/ui/molecules/composers";

export const InlineComposer = () => {
  const hasMessageContext = useHasParentContext(MessageContext);
  if (!hasMessageContext) {
    throw new Error("MessageContext not found");
  }

  const interactionState = useMessage((c) => c.interactionState);

  if (interactionState === "replying") {
    return <ReplyComposer />;
  }
  if (interactionState === "editing") {
    return <EditComposer />;
  }
  return null;
};
