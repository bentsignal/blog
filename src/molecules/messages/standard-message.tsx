import { memo } from "react";
import { EnhancedMessage } from "@/types/message-types";
import * as Message from "@/atoms/message";
import { InlineComposer } from "@/molecules/composers";

export const StandardMessage = memo(
  ({ message }: { message: EnhancedMessage }) => {
    return (
      <Message.Provider message={message}>
        <Message.Frame className="mt-3">
          <div className="flex gap-3">
            <Message.PFP />
            <Message.Body>
              <Message.Header />
              <Message.Content />
              <Message.Reactions />
            </Message.Body>
          </div>
          <Message.Actions />
        </Message.Frame>
        <InlineComposer />
      </Message.Provider>
    );
  },
  (prev, next) => {
    if (prev.message.name !== next.message.name) return false;
    if (prev.message.pfp !== next.message.pfp) return false;
    if (prev.message.content !== next.message.content) return false;
    if (prev.message.reactionSignature !== next.message.reactionSignature) {
      return false;
    }
    return true;
  },
);
