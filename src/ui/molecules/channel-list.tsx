"use client";

import { useChat } from "@/context/chat-context";
import * as ListContext from "@/context/list-context";
import { ChannelDataWithMessagePreview } from "@/types/channel-types";
import { cn } from "@/utils/style-utils";
import { PaginationStatus } from "convex/react";
import * as List from "@/ui/atoms/list";
import * as Shapes from "@/ui/atoms/shapes";

export const ChannelList = ({
  channels,
  status,
}: {
  channels: ChannelDataWithMessagePreview[];
  status: PaginationStatus;
}) => {
  const setCurrentChannel = useChat((c) => c.setCurrentChannel);

  if (status === "LoadingFirstPage") {
    return (
      <ListContext.Provider>
        <List.Frame>
          <List.Content className="flex animate-pulse flex-col gap-2 py-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "dark:bg-card bg-accent mx-4 flex items-center gap-3 rounded-2xl p-3 px-4",
                )}
              >
                <span className="text-muted-foreground text-3xl">#</span>
                <div className="flex max-w-full flex-col gap-2 pr-8">
                  <Shapes.HorizontalBar width={Math.random() * 150 + 50} />
                  <Shapes.HorizontalBar width={Math.random() * 150 + 50} />
                </div>
              </div>
            ))}
          </List.Content>
        </List.Frame>
      </ListContext.Provider>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center">
        No channels found
      </div>
    );
  }

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
                "mx-4 flex cursor-pointer items-center gap-3 rounded-2xl p-3 px-4 select-none",
              )}
            >
              <span className="text-muted-foreground text-3xl">#</span>
              <div className="flex max-w-full flex-col pr-8">
                <span className="text-sm font-bold">{channel.name}</span>
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
