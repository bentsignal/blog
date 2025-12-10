"use client";

import { channels as baseChannels, channelSlugs } from "@/blog/channels";
import { api } from "@/convex/_generated/api";
import * as Search from "@/features/search/atom";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { useQuery } from "convex/react";

const useChannelList = () => {
  const hasSearchContext = useHasParentContext(Search.Context);
  const searchTerm = Search.useContext((c) => c.searchTerm);

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

  return channels;
};

export { useChannelList };
