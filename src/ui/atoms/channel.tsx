"use client";

import { Fragment } from "react";
import { useAuth } from "@/context/auth-context";
import { useChannel } from "@/context/channel-context";
import { Provider as ListProvider } from "@/context/list-context";
import { areSameDay } from "@/utils/time-utils";
import * as Auth from "@/ui/atoms/auth";
import * as List from "@/ui/atoms/list";
import * as Message from "@/ui/atoms/message";
import { ChannelComposer } from "@/ui/molecules/composers";
import { DateMarker } from "@/ui/molecules/date-marker";
import {
  ChainedMessage,
  ReplyMessage,
  StandardMessage,
} from "@/ui/molecules/messages";

export const Header = () => {
  const signedIn = useAuth((c) => c.signedIn);
  const channel = useChannel((c) => c.channel);
  return (
    <div className="bg-muted m-4 mb-0 flex items-center justify-between rounded-2xl p-3">
      <div className="flex flex-1 items-center gap-3 pl-1">
        <span className="text-3xl font-semibold">#</span>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-sm font-bold">{channel.name}</span>
          <span className="text-muted-foreground text-xs">Text Channel</span>
        </div>
      </div>
      {signedIn ? <Auth.ProfileButton /> : <Auth.SignInButton />}
    </div>
  );
};

export const Body = () => {
  const loadingStatus = useChannel((c) => c.loadingStatus);
  const channelComposerInputRef = useChannel((c) => c.channelComposerInputRef);
  const loadMoreMessages = useChannel((c) => c.loadMoreMessages);

  if (loadingStatus === "LoadingFirstPage") {
    return <Skeleton />;
  }

  return (
    <ListProvider
      stickToBottom={true}
      scrollToBottomOnMount={true}
      maintainScrollPositionOnAppend={true}
      loadingStatus={loadingStatus}
      skeletonComponent={<Message.Skeleton />}
      loadMore={loadMoreMessages}
      mainComposerInputRef={channelComposerInputRef}
    >
      <Messages />
      <ChannelComposer />
    </ListProvider>
  );
};

const Skeleton = () => {
  return (
    <ListProvider>
      <List.Frame>
        <List.Content className="py-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Message.Skeleton key={index} index={index} />
          ))}
        </List.Content>
      </List.Frame>
      <ChannelComposer />
    </ListProvider>
  );
};

const Messages = () => {
  const messages = useChannel((c) => c.messages);
  return (
    <List.Frame>
      <List.Content className="pb-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          // messages sent by the same user within 5 minutes of each other are chained together
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
                <StandardMessage message={message} />
              )}
            </Fragment>
          );
        })}
        <List.ScrollToBottomButton />
      </List.Content>
    </List.Frame>
  );
};

export const ErrorMessage = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1">
      <div className="text-destructive text-sm font-bold">
        Failed to load messages
      </div>
      <div className="text-muted-foreground text-xs">
        Sorry about that, something went wrong.
      </div>
    </div>
  );
};
