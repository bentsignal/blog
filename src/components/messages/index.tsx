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
    api.messages.get,
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

  const reversedResults = results.slice().reverse();

  return (
    <Message.List autoScroll={true}>
      {/* if the user scrolls too fast, they may scroll past the loader observer and be 
      stuck at the top of the message list. The load more button is a fallback to allow
      them to load more messages if this happens */}
      {status !== "Exhausted" && (
        <Button
          onClick={() => loadMore(config.pageSize)}
          disabled={status === "LoadingMore"}
          className="mx-6 mt-3 text-sm font-bold"
        >
          Load More
        </Button>
      )}
      {reversedResults.map((message, index) => {
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
            <UserMessage
              message={message}
              previousMessage={index > 0 ? reversedResults[index - 1] : null}
            />
          </PageLoader>
        ) : (
          <UserMessage
            key={message._id}
            message={message}
            previousMessage={index > 0 ? reversedResults[index - 1] : null}
          />
        );
      })}
    </Message.List>
  );
};

export const PureUserMessage = ({
  message,
  previousMessage,
}: {
  message: Message.Message;
  previousMessage: Message.Message | null;
}) => {
  // messages sent within 5 minutes of each other are chained together
  const chainMessage =
    previousMessage?.name === message.name &&
    message._creationTime - previousMessage._creationTime < 1000 * 60 * 5;

  if (previousMessage && chainMessage) {
    return (
      <Message.Provider message={message}>
        <Message.Frame>
          <Message.Body className="flex-row items-center">
            <Message.SideTime />
            <Message.Content />
          </Message.Body>
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
      </Message.Frame>
    </Message.Provider>
  );
};

const areMessagesEqual = (prev: Message.Message, next: Message.Message) => {
  if (prev.name !== next.name) return false;
  if (prev.pfp !== next.pfp) return false;
  if (
    prev.snapshots[prev.snapshots.length - 1].content !==
    next.snapshots[next.snapshots.length - 1].content
  ) {
    return false;
  }
  return true;
};

const UserMessage = memo(PureUserMessage, (prev, next) => {
  return areMessagesEqual(prev.message, next.message);
});
