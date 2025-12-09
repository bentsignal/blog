import { EditComposer, ReplyComposer } from "./variants";
import { MessageContext, useMessage } from "@/atoms/message";
import { useRequiredContext } from "@/lib/context";

const InlineComposer = () => {
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

export { InlineComposer };
