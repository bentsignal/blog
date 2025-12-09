import { MessageContext, useMessage } from "@/features/messages/atom";
import { EditComposer, ReplyComposer } from "./variants";
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
