"use client";

import { RefObject, useMemo, useRef } from "react";
import { INITIAL_PAGE_SIZE, PAGE_SIZE } from "@/config/channel-config";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { MessageDataWithUserInfo } from "@/types/message-types";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { PaginationStatus, usePaginatedQuery } from "convex/react";

type ChannelProps = {
  channel: Doc<"channels">;
};

interface ChannelContextType extends ChannelProps {
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
  channel,
  children,
}: ChannelProps & {
  children: React.ReactNode;
}) => {
  const channelComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channel: channel._id },
    {
      initialNumItems: INITIAL_PAGE_SIZE,
    },
  );

  const orderedResults = useMemo(() => results.slice().reverse(), [results]);

  const contextValue = useMemo(
    () => ({
      channel,
      channelComposerInputRef,
      loadingStatus: status,
      loadMoreMessages: () => loadMore(PAGE_SIZE),
      messages: orderedResults,
    }),
    [channel, channelComposerInputRef, orderedResults, status, loadMore],
  );

  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};
