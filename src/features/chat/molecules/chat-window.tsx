"use client";

import { ChannelBrowser, ChannelView } from "@/features/channel/molecules";
import * as Chat from "@/features/chat/atom";
import { useRequiredContext } from "@/lib/context";

const ChatWindow = () => {
  useRequiredContext(Chat.Context);

  const currentChannelSlug = Chat.use((c) => c.currentChannelSlug);

  if (currentChannelSlug) {
    return <ChannelView slug={currentChannelSlug} />;
  }

  return <ChannelBrowser />;
};

export { ChatWindow };
