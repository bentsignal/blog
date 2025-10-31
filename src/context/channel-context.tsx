"use client";

import { RefObject, useEffect, useMemo, useRef } from "react";
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

type ChannelProps = {
  slug: ChannelSlug;
};

interface ChannelContextType extends ChannelProps {
  channel: Channel;
  channelComposerInputRef: RefObject<HTMLTextAreaElement | null>;
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
  const channelComposerInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => {
      channelComposerInputRef.current?.focus();
    }, 50);
  }, [slug]);

  const channel = channels[slug];

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
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
      channelComposerInputRef,
      loadingStatus: status,
      loadMoreMessages: () => loadMore(PAGE_SIZE),
      messages: orderedResults,
    }),
    [slug, channel, channelComposerInputRef, orderedResults, status, loadMore],
  );

  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};
