"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { createStore } from "rostra";
import { api } from "@/convex/_generated/api";
import { getRandomWidth } from "@/utils/skeleton-utils";
import { findPostWithSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import * as Chat from "@/features/chat/atom";
import * as Search from "@/features/search/atom";
import * as Scroll from "@/atoms/scroll";
import * as Shapes from "@/atoms/shapes";
import { channels as baseChannels, channelSlugs } from "@/blog/channels";

function useInternalStore() {
  const searchTerm = Search.useStore((s) => s.searchTerm, { optional: true });

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
      searchTerm
        ? channel.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true,
    );
  return { channels };
}

export const { Store: ChannelListStore, useStore: useChannelListStore } =
  createStore(useInternalStore);

export const ChannelList = () => {
  const setCurrentChannelSlug = Chat.useStore((s) => s.setCurrentChannelSlug);
  const channels = useChannelListStore((s) => s.channels);
  const router = useRouter();

  if (channels.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center">
        No channels found
      </div>
    );
  }

  return (
    <Scroll.Store>
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
    </Scroll.Store>
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
