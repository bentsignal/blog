import { memo } from "react";
import * as Message from "./message";

const PureUserMessage = ({
  message,
  shouldChainMessages,
}: {
  message: Message.Message;
  shouldChainMessages: boolean;
}) => {
  // messages sent by the same user within 5 minutes of each other are chained together
  if (shouldChainMessages) {
    return (
      <Message.Provider message={message}>
        <Message.Frame>
          <Message.Body className="flex-row items-center">
            <Message.SideTime />
            <Message.Content />
          </Message.Body>
          <Message.Actions />
        </Message.Frame>
      </Message.Provider>
    );
  }

  return (
    <Message.Provider message={message}>
      <Message.Frame className="mt-3">
        <Message.PFP />
        <Message.Body>
          <Message.Header />
          <Message.Content />
        </Message.Body>
        <Message.Actions />
      </Message.Frame>
    </Message.Provider>
  );
};

export const UserMessage = memo(PureUserMessage, (prev, next) => {
  if (prev.message.name !== next.message.name) return false;
  if (prev.message.pfp !== next.message.pfp) return false;
  if (
    prev.message.snapshots[prev.message.snapshots.length - 1].content !==
    next.message.snapshots[next.message.snapshots.length - 1].content
  )
    return false;
  if (prev.shouldChainMessages !== next.shouldChainMessages) return false;
  return true;
});
