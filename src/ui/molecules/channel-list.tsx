"use client";

import {
  ChannelListContext,
  useChannelList,
} from "@/context/channel-list-context";
import { useChatWindow } from "@/context/chat-window-context";
import { Provider as ListProvider } from "@/context/list-context";
import { validatePostSlug } from "@/utils/slug-utils";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { useRouter } from "next/navigation";
import * as List from "@/ui/atoms/list";
import * as Shapes from "@/ui/atoms/shapes";

export const ChannelList = () => {
  const hasChannelListContext = useHasParentContext(ChannelListContext);
  if (!hasChannelListContext) {
    throw new Error("ChannelListContext not found");
  }

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
    <ListProvider>
      <List.Frame>
        <List.Content className="flex flex-col gap-2 py-4">
          {channels.map((channel) => (
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
                {channel.previewString === undefined ? (
                  <Shapes.HorizontalBar className="mt-1" width={200} />
                ) : channel.previewString === null ? (
                  <span className="text-muted-foreground truncate text-xs">
                    Preview unavailable
                  </span>
                ) : (
                  <span className="text-muted-foreground truncate text-xs">
                    {channel.previewString}
                  </span>
                )}
              </div>
            </div>
          ))}
        </List.Content>
        <List.ScrollToTopButton className="absolute right-0 bottom-0 z-6 p-4" />
      </List.Frame>
    </ListProvider>
  );
};
