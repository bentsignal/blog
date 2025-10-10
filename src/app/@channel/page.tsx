"use client";

import { Fragment } from "react";
import { api } from "@/convex/_generated/api";
import { ChannelProvider } from "@/providers/channel-provider";
import { usePaginatedQuery, useQuery } from "convex/react";
import * as Auth from "@/components/auth";
import { useAuth } from "@/components/auth";
import { ChannelComposer } from "@/components/composers";
import { DateMarker } from "@/components/date-marker";
import * as List from "@/components/list";
import {
  ChainedMessage,
  ReplyMessage,
  UserMessage,
} from "@/components/messages";
import * as Message from "@/components/messages/message";
import * as Card from "@/components/ui/card";
import { areSameDay } from "@/lib/time";

export default function Channel() {
  const channel = useQuery(api.channel.getDefault);
  return (
    <Card.Card className="h-[700px] max-h-full w-full max-w-md rounded-3xl p-0">
      <Card.CardContent className="flex h-full flex-col p-0">
        <ChannelProvider channel={channel}>
          <Header />
          <Messages />
          <ChannelComposer />
        </ChannelProvider>
      </Card.CardContent>
    </Card.Card>
  );
}

const Header = () => {
  const signedIn = useAuth((c) => c.signedIn);
  return (
    <div className="bg-muted m-4 mb-0 flex items-center justify-between rounded-2xl p-3">
      <div className="flex items-center gap-3 pl-1">
        <span className="text-3xl font-semibold">#</span>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold">General</span>
          <span className="text-muted-foreground text-xs">Text Channel</span>
        </div>
      </div>
      {signedIn ? <Auth.Profile /> : <Auth.SignIn />}
    </div>
  );
};

export const Messages = () => {
  const config = {
    initialPageSize: 50,
    pageSize: 50,
  };

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    {},
    {
      initialNumItems: config.initialPageSize,
    },
  );

  if (status === "LoadingFirstPage") {
    return (
      <List.Provider>
        <List.Frame>
          <List.Content className="py-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <Message.Skeleton key={index} index={index} />
            ))}
          </List.Content>
        </List.Frame>
      </List.Provider>
    );
  }

  if (!results) {
    return <Message.Error />;
  }

  const reversedResults = results.slice().reverse();

  return (
    <List.Provider
      stickToBottom={true}
      scrollToBottomOnMount={true}
      maintainScrollPositionOnAppend={true}
      loadingStatus={status}
      skeletonComponent={<Message.Skeleton />}
      loadMore={() => loadMore(config.pageSize)}
    >
      <List.Frame>
        <List.Content className="pb-4">
          {reversedResults.map((message, index) => {
            const previousMessage =
              index > 0 ? reversedResults[index - 1] : null;
            // messages sent by the same userwithin 5 minutes of each other are chained together
            const shouldChainMessages =
              previousMessage?.profile === message.profile &&
              message._creationTime - previousMessage._creationTime <
                1000 * 60 * 5;
            // if neighboring messages are not sent on the same day, show the date to mark
            // the start of a new day
            const isSameDay = areSameDay(
              message._creationTime,
              previousMessage?._creationTime ?? 0,
            );
            const showDateMarker = !isSameDay && !shouldChainMessages;
            return (
              <Fragment key={message._id}>
                {showDateMarker && <DateMarker time={message._creationTime} />}
                {message.reply ? (
                  <ReplyMessage message={message} />
                ) : shouldChainMessages ? (
                  <ChainedMessage message={message} />
                ) : (
                  <UserMessage message={message} />
                )}
              </Fragment>
            );
          })}
          <List.ScrollToBottomButton />
        </List.Content>
      </List.Frame>
    </List.Provider>
  );
};
