"use client";

import { useChat } from "@/context/chat-context";
import { SearchContext, useSearch } from "@/context/search-context";
import { api } from "@/convex/_generated/api";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { usePaginatedQuery } from "convex/react";

export const ChannelList = () => {
  const hasSearchContext = useHasParentContext(SearchContext);
  if (!hasSearchContext) {
    throw new Error("SearchContext not found");
  }

  const setCurrentChannel = useChat((c) => c.setCurrentChannel);
  const debouncedSearchTerm = useSearch((c) => c.debouncedSearchTerm);

  const { results: channels } = usePaginatedQuery(
    api.channels.get,
    { searchTerm: debouncedSearchTerm },
    {
      initialNumItems: 10,
    },
  );

  return channels?.map((channel) => (
    <div
      key={channel._id}
      onClick={() => setCurrentChannel(channel)}
      className="hover:bg-card cursor-pointer rounded-md p-2 select-none"
    >
      {channel.name}
    </div>
  ));
};
