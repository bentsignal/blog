"use client";

import { useEffect, useMemo } from "react";
import { PaginationStatus, usePaginatedQuery } from "convex/react";
import type { Channel, ChannelSlug } from "@/blog/channels";
import type { EnhancedMessage } from "@/features/messages/types";
import { api } from "@/convex/_generated/api";
import { createContext, useRequiredContext } from "@/lib/context";
import * as Chat from "@/features/chat/atom";
import { channels } from "@/blog/channels";

const INITIAL_PAGE_SIZE = 50;
const PAGE_SIZE = 100;

const { Context, useContext } = createContext<{
  slug: ChannelSlug;
  channel: Channel;
  messages: EnhancedMessage[];
  loadingStatus: PaginationStatus;
  loadMoreMessages: () => void;
  numberOfPages: number;
}>({ displayName: "ChannelContext" });

const Provider = ({
  slug,
  children,
}: {
  slug: ChannelSlug;
  children: React.ReactNode;
}) => {
  useRequiredContext(Chat.Context);

  const chatWindowComposer = Chat.useContext((c) => c.composerInputRef);

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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
