"use client";

import { ChevronLeft } from "lucide-react";
import { useStore as useChannelStore } from "./channel-store";
import * as Chat from "@/features/chat/atom";

const Identifier = () => {
  const channelName = useChannelStore((s) => s.channel.name);
  return (
    <div className="flex flex-1 flex-col justify-center">
      <span className="text-sm font-bold">{channelName}</span>
      <span className="text-muted-foreground text-xs">Text Channel</span>
    </div>
  );
};

const BackButton = () => {
  const setCurrentChannelSlug = Chat.useStore((s) => s.setCurrentChannelSlug);
  return (
    <button
      onClick={() => setCurrentChannelSlug(undefined)}
      className="cursor-pointer px-0.5 py-1"
      aria-label="Close channel button, takes you back to the channel list"
    >
      <ChevronLeft className="size-5" />
    </button>
  );
};

export { Identifier, BackButton };
