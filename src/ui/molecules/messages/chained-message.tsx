import { memo } from "react";
import { Provider as MessageProvider } from "@/context/message-context";
import { MessageDataWithUserInfo } from "@/types/message-types";
import * as Message from "@/ui/atoms/message";
import { InlineComposer } from "@/ui/molecules/composers";

export const ChainedMessage = memo(
  ({ message }: { message: MessageDataWithUserInfo }) => {
    return (
      <MessageProvider message={message}>
        <Message.Frame>
          <div className="flex items-center">
            <Message.SideTime />
            <Message.Content />
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
    if (
      prev.message.snapshots[prev.message.snapshots.length - 1].content !==
      next.message.snapshots[next.message.snapshots.length - 1].content
    )
      return false;
    return true;
  },
);
