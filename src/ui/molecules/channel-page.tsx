"use client";

import {
  Provider as ChannelProvider,
  useChannel,
} from "@/context/channel-context";
import { useChatWindow } from "@/context/chat-window-context";
import { type ChannelSlug } from "@/data/channels";
import { ChevronLeft } from "lucide-react";
import * as List from "@/ui/atoms/list";
import * as Message from "@/ui/atoms/message";
import * as Scroll from "@/ui/atoms/scroll";
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
        <button
          onClick={() => setCurrentChannelSlug(undefined)}
          className="cursor-pointer px-0.5 py-1"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-sm font-bold">{channelName}</span>
          <span className="text-muted-foreground text-xs">Text Channel</span>
        </div>
      </div>
    </div>
  );
};

const Body = () => {
  const loadingStatus = useChannel((c) => c.loadingStatus);
  const loadMoreMessages = useChannel((c) => c.loadMoreMessages);
  const messages = useChannel((c) => c.messages);
  const numberOfPages = useChannel((c) => c.numberOfPages);

  if (loadingStatus === "LoadingFirstPage") {
    return (
      <Scroll.Provider>
        <Scroll.Frame>
          <div className="flex flex-1 flex-col justify-end overflow-hidden mask-t-from-95%">
            {Array.from({ length: 30 }).map((_, index) => (
              <Message.Skeleton key={index} index={index} />
            ))}
          </div>
        </Scroll.Frame>
        <ChannelComposer />
      </Scroll.Provider>
    );
  }

  return (
    <Scroll.Provider startAt="bottom">
      <List.Provider
        isBottomSticky={true}
        loadingStatus={loadingStatus}
        skeletonComponent={<Message.Skeleton />}
        loadMore={loadMoreMessages}
        numberOfPages={numberOfPages}
      >
        <MessageList messages={messages} />
        <ChannelComposer />
      </List.Provider>
    </Scroll.Provider>
  );
};
