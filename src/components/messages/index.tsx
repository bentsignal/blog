import { memo } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import * as Message from "./message";

export const Messages = () => {
  const messages = useQuery(api.messages.getMessages);
  if (!messages || messages.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {messages?.map((message) => (
        <UserMessage key={message._id} message={message} />
      ))}
    </div>
  );
};

export const PureUserMessage = ({ message }: { message: Message.Message }) => {
  return (
    <Message.Provider message={message}>
      <Message.Frame>
        <Message.PFP />
        <Message.Body>
          <Message.Header />
          <Message.Content />
        </Message.Body>
      </Message.Frame>
    </Message.Provider>
  );
};

const areMessagesEqual = (prev: Message.Message, next: Message.Message) => {
  if (prev._id !== next._id) return false;
  if (prev._creationTime !== next._creationTime) return false;
  if (prev.username !== next.username) return false;
  if (prev.pfp !== next.pfp) return false;
  if (prev.content !== next.content) return false;
  return true;
};

const UserMessage = memo(PureUserMessage, (prev, next) => {
  return areMessagesEqual(prev.message, next.message);
});
