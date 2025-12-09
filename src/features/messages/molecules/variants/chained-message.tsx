import { memo } from "react";
import { InlineComposer } from "@/features/composer/molecules";
import * as Message from "@/features/messages/atom";

export const ChainedMessage = memo(
  ({ message }: { message: Message.EnhancedMessage }) => {
    return (
      <Message.Provider message={message}>
        <Message.Frame>
          <div className="flex items-center">
            <Message.SideTime />
            <Message.Body>
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
