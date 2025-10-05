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
        const previousMessage = index > 0 ? reversedResults[index - 1] : null;
        // messages sent by the same userwithin 5 minutes of each other are chained together
        const shouldChainMessages =
          previousMessage?.profile === message.profile &&
          message._creationTime - previousMessage._creationTime < 1000 * 60 * 5;
        return index === loaderIndex ? (
          <PageLoader
            key={message._id}
            status={status}
            loadMore={() => loadMore(config.pageSize)}
          >
            <UserMessage
              message={message}
              shouldChainMessages={shouldChainMessages}
            />
          </PageLoader>
        ) : (
          <UserMessage
            key={message._id}
            message={message}
            shouldChainMessages={shouldChainMessages}
          />
        );
      })}
    </Message.List>
  );
};

export const PureUserMessage = ({
  message,
  shouldChainMessages,
}: {
  message: Message.Message;
  shouldChainMessages: boolean;
}) => {
  // messages sent by the same userwithin 5 minutes of each other are chained together
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

const UserMessage = memo(PureUserMessage, (prev, next) => {
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
