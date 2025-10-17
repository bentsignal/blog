"use client";

import { useAuth } from "@/context/auth-context";
import { useChannel } from "@/context/channel-context";
import { Provider as ListProvider } from "@/context/list-context";
import * as Auth from "@/ui/atoms/auth";
import * as List from "@/ui/atoms/list";
import * as Message from "@/ui/atoms/message";
import { ChannelComposer } from "@/ui/molecules/composers";
import { MessageList } from "@/ui/molecules/message-list";

export default function ChannelPage() {
  return (
    <>
      <Header />
      <Body />
    </>
  );
}

export const Header = () => {
  const signedIn = useAuth((c) => c.signedIn);
  const channelName = useChannel((c) => c.channel.name);
  return (
    <div className="bg-muted m-4 mb-0 flex items-center justify-between rounded-2xl p-3">
      <div className="flex flex-1 items-center gap-3 pl-1">
        <span className="text-3xl font-semibold">#</span>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-sm font-bold">{channelName}</span>
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
  const messageCount = useChannel((c) => c.messages.length);

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
      contentVersion={messageCount}
    >
      <Content />
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

const Content = () => {
  const messages = useChannel((c) => c.messages);
  return (
    <>
      <MessageList messages={messages} />
      <ChannelComposer />
    </>
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
