"use client";

import * as Chat from "@/features/chat/atom";
import { ChannelComposer } from "@/features/composer/molecules";
import * as Message from "@/features/messages/atom";
import { MessageList } from "@/features/messages/molecules";
import { ChevronLeft } from "lucide-react";
import {
  Context as ChannelContext,
  use as useChannel,
} from "./channel-context";
import * as List from "@/atoms/list";
import * as Scroll from "@/atoms/scroll";
import { useRequiredContext } from "@/lib/context";

const Header = () => {
  useRequiredContext(ChannelContext);
  useRequiredContext(Chat.Context);

  const channelName = useChannel((c) => c.channel.name);
  const setCurrentChannelSlug = Chat.use((c) => c.setCurrentChannelSlug);

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
  useRequiredContext(ChannelContext);
  useRequiredContext(Chat.Context);

  const loadingStatus = useChannel((c) => c.loadingStatus);
  const loadMoreMessages = useChannel((c) => c.loadMoreMessages);
  const messages = useChannel((c) => c.messages);
  const numberOfPages = useChannel((c) => c.numberOfPages);

  if (loadingStatus === "LoadingFirstPage") {
    return (
      <Scroll.Provider>
        <Scroll.Wrapper>
          <div className="flex flex-1 flex-col justify-end overflow-hidden mask-t-from-95%">
            {Array.from({ length: 30 }).map((_, index) => (
              <Message.Skeleton key={index} index={index} />
            ))}
          </div>
        </Scroll.Wrapper>
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

export { Header, Body };
