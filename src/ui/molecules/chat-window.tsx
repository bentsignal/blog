"use client";

import { useChat } from "@/context/chat-context";
import { SearchContext, useSearch } from "@/context/search-context";
import { api } from "@/convex/_generated/api";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { usePaginatedQuery } from "convex/react";
import { SearchBar } from "./search-bar";
import { TopControls } from "./top-controls";
import * as Auth from "@/ui/atoms/auth";
import { ChannelList } from "@/ui/molecules/channel-list";
import { ChannelPage } from "@/ui/molecules/channel-page";

export const ChatWindow = () => {
  const hasSearchContext = useHasParentContext(SearchContext);
  if (!hasSearchContext) {
    throw new Error("SearchContext not found");
  }

  const currentChannel = useChat((c) => c.currentChannel);
  const debouncedSearchTerm = useSearch((c) => c.debouncedSearchTerm);

  const { results: channels, status } = usePaginatedQuery(
    api.channels.get,
    { searchTerm: debouncedSearchTerm },
    {
      initialNumItems: 30,
    },
  );

  if (currentChannel) {
    return <ChannelPage channel={currentChannel} />;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <TopControls className="md:hidden" />
      <div className="bg-muted mx-4 flex rounded-2xl p-3 md:mt-4">
        <SearchBar placeholder="Search" />
        <Auth.PrimaryButton />
      </div>
      <ChannelList channels={channels} status={status} />
    </div>
  );
};
