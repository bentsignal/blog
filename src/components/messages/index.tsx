import { memo } from "react";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import PageLoader from "../page-loader";
import { Button } from "../ui/button";
import * as Message from "./message";

const config = {
  initialPageSize: 40,
  pageSize: 40,
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
      {/* if the user scrolls too fast, they may scroll past the loader observer and be 
      stuck at the top of the message list. The load more button is a fallback to allow
      them to load more messages if this happens */}
      {status !== "Exhausted" && (
        <Button
          onClick={() => loadMore(config.pageSize)}
          disabled={status === "LoadingMore"}
          className="text-sm font-bold"
        >
          Load More
        </Button>
      )}
      {results
        .slice()
        .reverse()
        .map((message, index) => {
          // wrap a message in an invisible PageLoader component that contains
          // an observer. when the message comes into view, the observer will load
          // more messages.
          const loaderIndex =
            status === "CanLoadMore"
              ? Math.min(config.loadingIndex, results.length - 1)
              : -1;
          return index === loaderIndex ? (
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
  if (prev.name !== next.name) return false;
  if (prev.pfp !== next.pfp) return false;
  if (prev.content !== next.content) return false;
  return true;
};

const UserMessage = memo(PureUserMessage, (prev, next) => {
  return areMessagesEqual(prev.message, next.message);
});
