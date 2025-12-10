import * as Message from "@/features/messages/atom";
import { EditComposer, ReplyComposer } from "./variants";
import { useRequiredContext } from "@/lib/context";

const InlineComposer = () => {
  useRequiredContext(Message.Context);

  const interactionState = Message.use((c) => c.interactionState);

  if (interactionState === "replying") {
    return <ReplyComposer />;
  }
  if (interactionState === "editing") {
    return <EditComposer />;
  }
  return null;
};

export { InlineComposer };
