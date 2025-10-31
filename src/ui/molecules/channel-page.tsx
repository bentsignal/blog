"use client";

import {
  Provider as ChannelProvider,
  useChannel,
} from "@/context/channel-context";
import { useChatWindow } from "@/context/chat-window-context";
import { Provider as ListProvider } from "@/context/list-context";
import { type ChannelSlug } from "@/data/channels";
import { ChevronLeft } from "lucide-react";
import * as Auth from "@/ui/atoms/auth";
import * as List from "@/ui/atoms/list";
import * as Message from "@/ui/atoms/message";
import { ChannelComposer } from "@/ui/molecules/composers";
import { MessageList } from "@/ui/molecules/message-list";
import { TopControls } from "@/ui/molecules/top-controls";

export const ChannelPage = ({ slug }: { slug: ChannelSlug }) => {
  return (
    <ChannelProvider slug={slug}>
      <div className="flex h-full w-full flex-col">
        <TopControls className="md:hidden" />
        <Header />
        <Body />
      </div>
    </ChannelProvider>
  );
};

const Header = () => {
  const channelName = useChannel((c) => c.channel.name);
  const setCurrentChannelSlug = useChatWindow((c) => c.setCurrentChannelSlug);
  return (
    <div className="bg-muted mx-4 flex items-center justify-between rounded-2xl p-3 pl-2 md:mt-4">
      <div className="flex flex-1 items-center gap-2 pl-1">
        <ChevronLeft
          className="size-5 cursor-pointer"
          onClick={() => setCurrentChannelSlug(undefined)}
        />
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-sm font-bold">{channelName}</span>
          <span className="text-muted-foreground text-xs">Text Channel</span>
        </div>
      </div>
      <Auth.PrimaryButton />
    </div>
  );
};

const Body = () => {
  const loadingStatus = useChannel((c) => c.loadingStatus);
  const channelComposerInputRef = useChannel((c) => c.channelComposerInputRef);
  const loadMoreMessages = useChannel((c) => c.loadMoreMessages);
  const messages = useChannel((c) => c.messages);

  if (loadingStatus === "LoadingFirstPage") {
    return (
      <ListProvider>
        <List.Frame>
          <List.Content className="py-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <Message.Skeleton key={index} index={index} />
            ))}
          </List.Content>
        </List.Frame>
        <ChannelComposer />
      </ListProvider>
    );
  }

  return (
    <ListProvider
      stickToBottom={true}
      startAt="bottom"
      maintainScrollOnContentChange={true}
      loadingStatus={loadingStatus}
      skeletonComponent={<Message.Skeleton />}
      loadMore={loadMoreMessages}
      composerInputRef={channelComposerInputRef}
      contentVersion={messages.length}
    >
      <MessageList messages={messages} />
      <ChannelComposer />
    </ListProvider>
  );
};
