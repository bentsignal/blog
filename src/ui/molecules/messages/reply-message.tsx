import { memo } from "react";
import * as MessageContext from "@/context/message-context";
import { MessageDataWithUserInfo } from "@/types/message-types";
import * as Message from "@/ui/atoms/message";
import { InlineComposer } from "@/ui/molecules/composers";

export const ReplyMessage = memo(
  ({ message }: { message: MessageDataWithUserInfo }) => {
    return (
      <MessageContext.Provider message={message}>
        <Message.Frame className="mt-3">
          <div className="flex flex-col">
            <Message.ReplyPreview />
            <div className="flex gap-3">
              <Message.PFP />
              <div className="flex flex-col">
                <Message.Header />
                <Message.Content />
              </div>
            </div>
          </div>
          <Message.Actions />
        </Message.Frame>
        <InlineComposer />
      </MessageContext.Provider>
    );
  },
  (prev, next) => {
    if (prev.message.name !== next.message.name) return false;
    if (prev.message.pfp !== next.message.pfp) return false;
    if (
      prev.message.snapshots[prev.message.snapshots.length - 1].content !==
      next.message.snapshots[next.message.snapshots.length - 1].content
    )
      return false;
    if (
      prev.message.reply?.snapshots[prev.message.reply?.snapshots.length - 1]
        .content !==
      next.message.reply?.snapshots[next.message.reply?.snapshots.length - 1]
        .content
    )
      return false;
    if (prev.message.reply?.name !== next.message.reply?.name) return false;
    return true;
  },
);
