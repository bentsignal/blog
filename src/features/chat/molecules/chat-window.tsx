"use client";

import { ChannelBrowser } from "@/features/channel/molecules/channel-browser";
import { ChannelView } from "@/features/channel/molecules/channel-view";
import * as Chat from "@/features/chat/atom";

export const ChatWindow = () => {
  const currentChannelSlug = Chat.useContext((c) => c.currentChannelSlug);

  if (currentChannelSlug) {
    return <ChannelView slug={currentChannelSlug} />;
  }

  return <ChannelBrowser />;
};
