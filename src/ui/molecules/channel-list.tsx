"use client";

import { useChat } from "@/context/chat-context";
import * as ListContext from "@/context/list-context";
import { SearchContext, useSearch } from "@/context/search-context";
import { api } from "@/convex/_generated/api";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { usePaginatedQuery } from "convex/react";
import * as List from "@/ui/atoms/list";

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
      initialNumItems: 30,
    },
  );

  return (
    <ListContext.Provider>
      <List.Frame>
        <List.Content className="flex flex-col gap-2 py-4">
          {channels.map((channel) => (
            <div
              key={channel._id}
              onClick={() => setCurrentChannel(channel)}
              className={cn(
                "dark:bg-card dark:hover:bg-muted bg-accent hover:bg-muted transition-colors duration-100",
                "mx-4 flex cursor-pointer items-center gap-3 rounded-md p-3 px-4 select-none",
              )}
            >
              <span className="text-3xl font-bold">#</span>
              <div className="flex max-w-full flex-col pr-8">
                <span className="text-sm font-semibold">{channel.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {channel.messagePreview}
                </span>
              </div>
            </div>
          ))}
        </List.Content>
        <List.ScrollToTopButton className="absolute right-0 bottom-0 z-6 p-4" />
      </List.Frame>
    </ListContext.Provider>
  );
};
