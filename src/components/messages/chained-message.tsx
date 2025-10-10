import { memo } from "react";
import * as Message from "./message";

const PureChainedMessage = ({ message }: { message: Message.Message }) => {
  return (
    <Message.Provider message={message}>
      <Message.Frame>
        <div className="flex items-center">
          <Message.SideTime />
          <Message.Content />
        </div>
        <Message.Actions />
      </Message.Frame>
      <Message.ReplyInline />
      <Message.EditInline />
    </Message.Provider>
  );
};

export const ChainedMessage = memo(PureChainedMessage, (prev, next) => {
  if (prev.message.name !== next.message.name) return false;
  if (prev.message.pfp !== next.message.pfp) return false;
  if (
    prev.message.snapshots[prev.message.snapshots.length - 1].content !==
    next.message.snapshots[next.message.snapshots.length - 1].content
  )
    return false;
  return true;
});
