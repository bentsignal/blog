import * as Message from "./message";

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
