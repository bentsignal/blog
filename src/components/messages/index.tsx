import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import * as Message from "./message";

export const Messages = () => {
  const { isAuthenticated } = useConvexAuth();
  const args = isAuthenticated ? {} : "skip";
  const messages = useQuery(api.messages.getMessages, args);
  if (!isAuthenticated) return <div>log in to see messages</div>;
  if (!messages || messages.length === 0) return <div>no messages</div>;
  return (
    <div>
      {messages?.map((message) => (
        <div key={message._id}>{message.content}</div>
      ))}
    </div>
  );
};

export const UserMessage = ({ message }: { message: Message.Message }) => {
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
