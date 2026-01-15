import { EditComposer } from "./edit-composer";
import { ReplyComposer } from "./reply-composer";
import * as Message from "@/features/messages/atom";

const InlineComposer = () => {
  const interactionState = Message.useStore((s) => s.interactionState);

  if (interactionState === "replying") {
    return <ReplyComposer />;
  }
  if (interactionState === "editing") {
    return <EditComposer />;
  }
  return null;
};

export { InlineComposer };
