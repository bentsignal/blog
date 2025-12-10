"use client";

import * as Chat from "@/features/chat/atom";
import { ChevronLeft } from "lucide-react";
import {
  Context as ChannelContext,
  useContext as useChannel,
} from "./channel-context";
import { useRequiredContext } from "@/lib/context";

const Identifier = () => {
  useRequiredContext(ChannelContext);
  const channelName = useChannel((c) => c.channel.name);
  return (
    <div className="flex flex-1 flex-col justify-center">
      <span className="text-sm font-bold">{channelName}</span>
      <span className="text-muted-foreground text-xs">Text Channel</span>
    </div>
  );
};

const BackButton = () => {
  useRequiredContext(Chat.Context);
  const setCurrentChannelSlug = Chat.useContext((c) => c.setCurrentChannelSlug);
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
