"use client";

import { useRouter } from "next/navigation";
import { useChannelList } from "../hooks/use-channel-list";
import { useRequiredContext } from "@/lib/context";
import { getRandomWidth } from "@/utils/skeleton-utils";
import { findPostWithSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import * as Chat from "@/features/chat/atom";
import * as Scroll from "@/atoms/scroll";
import * as Shapes from "@/atoms/shapes";

export const ChannelList = () => {
  useRequiredContext(Chat.Context);

  const setCurrentChannelSlug = Chat.useContext((c) => c.setCurrentChannelSlug);
  const channels = useChannelList();
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
