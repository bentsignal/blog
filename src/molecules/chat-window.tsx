"use client";

import { useChatWindow } from "@/context/chat-window-context";
import { ChannelBrowser } from "@/molecules/channel-browser";
import { ChannelPage } from "@/molecules/channel-page";

export const ChatWindow = () => {
  const currentChannelSlug = useChatWindow((c) => c.currentChannelSlug);

  if (currentChannelSlug) {
    return <ChannelPage slug={currentChannelSlug} />;
  }

  return <ChannelBrowser />;
};
