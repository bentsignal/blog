"use client";

import { useEffect, useMemo } from "react";
import { PaginationStatus, usePaginatedQuery } from "convex/react";
import { createStore } from "rostra";
import type { Channel, ChannelSlug } from "@/blog/channels";
import type { EnhancedMessage } from "@/features/messages/types";
import { api } from "@/convex/_generated/api";
import * as Chat from "@/features/chat/atom";
import { channels } from "@/blog/channels";

const INITIAL_PAGE_SIZE = 50;
const PAGE_SIZE = 100;

type StoreType = {
  slug: ChannelSlug;
  channel: Channel;
  messages: EnhancedMessage[];
  loadingStatus: PaginationStatus;
  loadMoreMessages: () => void;
  numberOfPages: number;
};

type StoreProps = {
  slug: ChannelSlug;
};

function useInternalStore({ slug }: StoreProps) {
  const chatWindowComposer = Chat.useStore((s) => s.composerInputRef);

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

  return {
    slug,
    channel,
    loadingStatus: status,
    loadMoreMessages: () => loadMore(PAGE_SIZE),
    messages: orderedResults,
    numberOfPages,
  };
}

export const { Store, useStore } = createStore<StoreProps, StoreType>(
  useInternalStore,
);
