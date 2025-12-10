import * as Message from "@/features/messages/atom";
import { EditComposer } from "./edit-composer";
import { ReplyComposer } from "./reply-composer";
import { useRequiredContext } from "@/lib/context";

const InlineComposer = () => {
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

export { InlineComposer };
