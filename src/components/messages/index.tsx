import { memo } from "react";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import PageLoader from "../page-loader";
import * as Message from "./message";

const config = {
  initialPageSize: 30,
  pageSize: 30,
  loadingIndex: 20,
};

export const Messages = () => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getMessages,
    {},
    {
      initialNumItems: config.initialPageSize,
    },
  );

  if (status === "LoadingFirstPage") {
    return (
      <Message.List>
        {Array.from({ length: 10 }).map((_, index) => (
          <Message.Skeleton key={index} />
        ))}
      </Message.List>
    );
  }

  if (!results) {
    return <Message.Error />;
  }

  return (
    <Message.List autoScroll={true}>
      {results.reverse().map((message, index) => {
        const loaderIndex =
          status === "CanLoadMore"
            ? Math.min(config.loadingIndex, results.length - 1)
            : -1;
        return index === loaderIndex || index === 0 ? (
          <PageLoader
            key={message._id}
            status={status}
            loadMore={() => loadMore(config.pageSize)}
          >
            <UserMessage message={message} />
          </PageLoader>
        ) : (
          <UserMessage key={message._id} message={message} />
        );
      })}
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
