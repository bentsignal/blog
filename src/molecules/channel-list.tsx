"use client";

import { useChatWindow } from "@/context/chat-window-context";
import { api } from "@/convex/_generated/api";
import {
  channels as baseChannels,
  channelSlugs,
  type Channel,
  type ChannelSlug,
} from "@/data/channels";
import { getRandomWidth } from "@/utils/skeleton-utils";
import { findPostWithSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import * as Scroll from "@/atoms/scroll";
import * as Shapes from "@/atoms/shapes";
import { SearchContext, useSearch } from "@/molecules/search-bar";
import { createContext, useRequiredContext } from "@/lib/context";

interface ChannelWithPreview extends Channel {
  slug: ChannelSlug;
  // if null, then theres no preview. if undefined, then the preview is loading
  previewString: string | null | undefined;
}

export const { Context: ChannelListContext, useContext: useChannelList } =
  createContext<{ channels: ChannelWithPreview[] }>({
    displayName: "ChannelListContext",
  });

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

export const ChannelList = () => {
  useRequiredContext(ChannelListContext);

  const setCurrentChannelSlug = useChatWindow((c) => c.setCurrentChannelSlug);
  const channels = useChannelList((c) => c.channels);

  const router = useRouter();

  if (channels.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center">
        No channels found
      </div>
    );
  }

  return (
    <Scroll.Provider>
      <Scroll.Wrapper>
        <Scroll.Container>
          <Scroll.Content className="flex flex-col gap-2 py-4">
            {channels.map((channel, index) => (
              <button
                key={channel.slug}
                onClick={() => {
                  setCurrentChannelSlug(channel.slug);
                  // if the channel has an associated post, redirect to the post's page
                  const postSlug = findPostWithSlug(channel.slug);
                  if (postSlug) {
                    router.push(`/${postSlug}`);
                  }
                }}
                className={cn(
                  "dark:bg-card dark:hover:bg-muted bg-accent hover:bg-muted transition-colors duration-100",
                  "mx-4 flex cursor-pointer items-center gap-3 rounded-2xl p-3 px-4 select-none",
                )}
              >
                <span className="text-muted-foreground text-3xl">#</span>
                <div className="flex max-w-full flex-col pr-8">
                  <span className="text-start text-sm font-bold">
                    {channel.name}
                  </span>
                  <Preview value={channel.previewString} index={index} />
                </div>
              </button>
            ))}
          </Scroll.Content>
        </Scroll.Container>
      </Scroll.Wrapper>
    </Scroll.Provider>
  );
};

const Preview = ({
  value,
  index,
}: {
  value: string | undefined | null;
  index: number;
}) => {
  if (value === undefined) {
    return (
      <Shapes.HorizontalBar
        className="mt-1"
        width={getRandomWidth({ seed: index, baseWidth: 100, maxWidth: 300 })}
      />
    );
  }
  const previewString = value ?? "No messages yet";
  return (
    <span className="text-muted-foreground truncate text-start text-xs">
      {previewString}
    </span>
  );
};
