"use client";

import { useEffect, useMemo } from "react";
import { api } from "@/convex/_generated/api";
import { channels, type Channel, type ChannelSlug } from "@/data/channels";
import * as Chat from "@/features/chat/atom";
import { type EnhancedMessage } from "@/features/messages/types";
import { PaginationStatus, usePaginatedQuery } from "convex/react";
import { INITIAL_PAGE_SIZE, PAGE_SIZE } from "../config";
import { createContext, useRequiredContext } from "@/lib/context";

const { Context, use } = createContext<{
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

  const chatWindowComposer = Chat.use((c) => c.composerInputRef);

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

export { Provider, Context, use };
