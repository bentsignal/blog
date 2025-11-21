"use client";

import { api } from "@/convex/_generated/api";
import {
  channels as baseChannels,
  channelSlugs,
  type Channel,
  type ChannelSlug,
} from "@/data/channels";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import { useQuery } from "convex/react";
import { SearchContext, useSearch } from "./search-context";

interface ChannelWithPreview extends Channel {
  slug: ChannelSlug;
  // if null, then theres no preview. if undefined, then the preview is loading
  previewString: string | null | undefined;
}

interface ChannelListContextType {
  channels: ChannelWithPreview[];
}

export const ChannelListContext = createContext<ChannelListContextType>(
  {} as ChannelListContextType,
);

ChannelListContext.displayName = "ChannelListContext";

export const useChannelList = <T,>(
  selector: ContextSelector<ChannelListContextType, T>,
) => useContextSelector(ChannelListContext, selector);

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const hasSearchContext = useHasParentContext(SearchContext);
  const searchTerm = useSearch((c) => c.searchTerm);

  const slugsWithPreviews = useQuery(api.messages.getPreviewsForChannels);

  const channels = channelSlugs
    .map((slug) => {
      return {
        ...baseChannels[slug],
        slug,
        previewString: slugsWithPreviews?.find(
          (preview) => preview.slug === slug,
        )?.previewString,
      };
    })
    .filter((channel) =>
      hasSearchContext
        ? channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true,
    );

  const contextValue = { channels };

  return (
    <ChannelListContext.Provider value={contextValue}>
      {children}
    </ChannelListContext.Provider>
  );
};
