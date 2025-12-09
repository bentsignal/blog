"use client";

import { useEffect, useMemo } from "react";
import { useChatWindow } from "@/context/chat-window-context";
import { api } from "@/convex/_generated/api";
import { channels, type Channel, type ChannelSlug } from "@/data/channels";
import { ChannelComposer } from "@/features/composer/molecules";
import * as Message from "@/features/messages/atom";
import { MessageList } from "@/features/messages/molecules";
import { PaginationStatus, usePaginatedQuery } from "convex/react";
import { ChevronLeft } from "lucide-react";
import * as List from "@/atoms/list";
import * as Scroll from "@/atoms/scroll";
import { TopControls } from "@/molecules/top-controls";
import { createContext } from "@/lib/context";

const INITIAL_PAGE_SIZE = 50;
const PAGE_SIZE = 100;

export const { Context: ChannelContext, useContext: useChannel } =
  createContext<{
    slug: ChannelSlug;
    channel: Channel;
    messages: Message.EnhancedMessage[];
    loadingStatus: PaginationStatus;
    loadMoreMessages: () => void;
    numberOfPages: number;
  }>({ displayName: "ChannelContext" });

export const Provider = ({
  slug,
  children,
}: {
  slug: ChannelSlug;
  children: React.ReactNode;
}) => {
  const chatWindowComposer = useChatWindow((c) => c.composerInputRef);

  useEffect(() => {
    setTimeout(() => {
      chatWindowComposer?.current?.focus();
    }, 50);
  }, [chatWindowComposer, slug]);

  const channel = channels[slug];

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getPage,
    { slug },
    {
      initialNumItems: INITIAL_PAGE_SIZE,
    },
  );

  const orderedResults = useMemo(() => results.slice().reverse(), [results]);

  const numberOfPages = useMemo(
    () =>
      Math.max(
        Math.ceil((results.length - INITIAL_PAGE_SIZE) / PAGE_SIZE) + 1,
        1,
      ),
    [results.length],
  );

  const contextValue = useMemo(
    () => ({
      slug,
      channel,
      loadingStatus: status,
      loadMoreMessages: () => loadMore(PAGE_SIZE),
      messages: orderedResults,
      numberOfPages,
    }),
    [slug, channel, orderedResults, status, loadMore, numberOfPages],
  );

  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};

export const ChannelPage = ({ slug }: { slug: ChannelSlug }) => {
  return (
    <Provider slug={slug}>
      <div className="flex h-full w-full flex-col">
        <TopControls className="md:hidden" />
        <Header />
        <Body />
      </div>
    </Provider>
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
