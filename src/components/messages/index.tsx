import { memo } from "react";
import { api } from "@/convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import * as Message from "./message";

export const Messages = () => {
  const {
    data: messages,
    isPending,
    error,
  } = useQuery(convexQuery(api.messages.getMessages, {}));

  if (isPending) {
    return (
      <Message.List>
        {Array.from({ length: 10 }).map((_, index) => (
          <Message.Skeleton key={index} />
        ))}
      </Message.List>
    );
  }

  if (error) {
    return <Message.Error />;
  }

  return (
    <Message.List autoScroll={true}>
      {messages.map((message) => (
        <UserMessage key={message._id} message={message} />
      ))}
    </Message.List>
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
  if (prev.name !== next.name) return false;
  if (prev.pfp !== next.pfp) return false;
  if (prev.content !== next.content) return false;
  return true;
};

const UserMessage = memo(PureUserMessage, (prev, next) => {
  return areMessagesEqual(prev.message, next.message);
});
