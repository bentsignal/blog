import { MessageContext, useMessage } from "@/context/message-context";
import { EditComposer, ReplyComposer } from "@/ui/molecules/composers";
import { useRequiredContext } from "@/hooks/use-required-context";

export const InlineComposer = () => {
  useRequiredContext(MessageContext);

  const interactionState = useMessage((c) => c.interactionState);

  if (interactionState === "replying") {
    return <ReplyComposer />;
  }
  if (interactionState === "editing") {
    return <EditComposer />;
  }
  return null;
};
