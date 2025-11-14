"use client";

import { useEffect, useMemo } from "react";
import { INITIAL_PAGE_SIZE, PAGE_SIZE } from "@/config/channel-config";
import { api } from "@/convex/_generated/api";
import { channels, ChannelSlug, type Channel } from "@/data/channels";
import { MessageDataWithUserInfo } from "@/types/message-types";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { PaginationStatus, usePaginatedQuery } from "convex/react";
import { useChatWindow } from "./chat-window-context";

type ChannelProps = {
  slug: ChannelSlug;
};

interface ChannelContextType extends ChannelProps {
  channel: Channel;
  messages: MessageDataWithUserInfo[];
  loadingStatus: PaginationStatus;
  loadMoreMessages: () => void;
}

export const ChannelContext = createContext<ChannelContextType>(
  {} as ChannelContextType,
);

export const useChannel = <T,>(
  selector: ContextSelector<ChannelContextType, T>,
) => useContextSelector(ChannelContext, selector);

export const Provider = ({
  slug,
  children,
}: ChannelProps & {
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

  const contextValue = useMemo(
    () => ({
      slug,
      channel,
      loadingStatus: status,
      loadMoreMessages: () => loadMore(PAGE_SIZE),
      messages: orderedResults,
    }),
    [slug, channel, orderedResults, status, loadMore],
  );

  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};
