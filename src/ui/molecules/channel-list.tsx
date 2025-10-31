"use client";

import { useChatWindow } from "@/context/chat-window-context";
import { Provider as ListProvider } from "@/context/list-context";
import { useSearch } from "@/context/search-context";
import { channels, type ChannelSlug } from "@/data/channels";
import { validatePostSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import { useRouter } from "next/navigation";
import * as List from "@/ui/atoms/list";

export const ChannelList = () => {
  const setCurrentChannelSlug = useChatWindow((c) => c.setCurrentChannelSlug);
  const searchTerm = useSearch((c) => c.searchTerm);

  const router = useRouter();

  const filteredChannels = Object.entries(channels)
    .map(([key, channel]) => ({
      slug: key as ChannelSlug,
      ...channel,
    }))
    .filter((channel) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  if (filteredChannels.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center">
        No channels found
      </div>
    );
  }

  return (
    <ListProvider>
      <List.Frame>
        <List.Content className="flex flex-col gap-2 py-4">
          {filteredChannels.map((channel) => (
            <div
              key={channel.slug}
              onClick={() => {
                setCurrentChannelSlug(channel.slug);
                // if the channel has an associated post, redirect to the post's page
                const postSlug = validatePostSlug(channel.slug);
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
                <span className="text-sm font-bold">{channel.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {/* {channel.previewMessage} */}
                  Preview Message
                </span>
              </div>
            </div>
          ))}
        </List.Content>
        <List.ScrollToTopButton className="absolute right-0 bottom-0 z-6 p-4" />
      </List.Frame>
    </ListProvider>
  );
};
