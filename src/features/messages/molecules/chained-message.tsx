import { memo } from "react";
import type { EnhancedMessage } from "@/features/messages/types";
import { InlineComposer } from "@/features/composer/molecules/inline-composer";
import * as Message from "@/features/messages/atom";

const ChainedMessage = memo(
  ({ message }: { message: EnhancedMessage }) => {
    return (
      <Message.Store message={message}>
        <Message.Container>
          <div className="flex items-center">
            <Message.SideTime />
            <Message.Body>
              <Message.Content />
              <Message.Reactions />
            </Message.Body>
          </div>
          <Message.Actions />
        </Message.Container>
        <InlineComposer />
      </Message.Store>
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

export { ChainedMessage };
