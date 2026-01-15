import { memo } from "react";
import type { EnhancedMessage } from "@/features/messages/types";
import { InlineComposer } from "@/features/composer/molecules/inline-composer";
import * as Message from "@/features/messages/atom";

const ReplyMessage = memo(
  ({ message }: { message: EnhancedMessage }) => {
    return (
      <Message.Store message={message}>
        <Message.Container className="mt-3">
          <div className="flex flex-col">
            <Message.ReplyPreview />
            <div className="flex gap-3">
              <Message.PFP />
              <Message.Body>
                <Message.Header />
                <Message.Content />
                <Message.Reactions />
              </Message.Body>
            </div>
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
    if (prev.message.reply?.name !== next.message.reply?.name) return false;
    if (prev.message.reply?.content !== next.message.reply?.content) {
      return false;
    }
    if (prev.message.reactionSignature !== next.message.reactionSignature) {
      return false;
    }
    return true;
  },
);

export { ReplyMessage };
