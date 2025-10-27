"use client";

import { useChat } from "@/context/chat-context";
import { SearchBar } from "./search-bar";
import * as Auth from "@/ui/atoms/auth";
import { ChannelList } from "@/ui/molecules/channel-list";
import { ChannelPage } from "@/ui/molecules/channel-page";

export const ChatWindow = () => {
  const currentChannel = useChat((c) => c.currentChannel);

  if (currentChannel) {
    return <ChannelPage channel={currentChannel} />;
  }

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <div className="bg-muted flex rounded-2xl p-3">
        <SearchBar placeholder="Search" />
        <Auth.PrimaryButton />
      </div>
      <ChannelList />
    </div>
  );
};
