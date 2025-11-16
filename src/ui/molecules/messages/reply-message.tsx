import { memo } from "react";
import { Provider as MessageProvider } from "@/context/message-context";
import { MessageDataWithUserInfo } from "@/types/message-types";
import * as Message from "@/ui/atoms/message";
import { InlineComposer } from "@/ui/molecules/composers";

export const ReplyMessage = memo(
  ({ message }: { message: MessageDataWithUserInfo }) => {
    return (
      <MessageProvider message={message}>
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
      </MessageProvider>
    );
  },
  (prev, next) => {
    if (prev.message.name !== next.message.name) return false;
    if (prev.message.pfp !== next.message.pfp) return false;
    if (prev.message.content !== next.message.content) return false;
    if (prev.message.reply?.content !== next.message.reply?.content)
      return false;
    if (prev.message.reply?.name !== next.message.reply?.name) return false;
    return true;
  },
);
