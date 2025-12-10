import * as Message from "@/features/messages/atom";
import { EditComposer, ReplyComposer } from "@/molecules/composers";
import { useRequiredContext } from "@/lib/context";

export const InlineComposer = () => {
  useRequiredContext(Message.Context);

  const interactionState = Message.useContext((c) => c.interactionState);

  if (interactionState === "replying") {
    return <ReplyComposer />;
  }
  if (interactionState === "editing") {
    return <EditComposer />;
  }
  return null;
};
