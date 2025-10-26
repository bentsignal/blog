"use client";

import { useChat } from "@/context/chat-context";
import * as SearchContext from "@/context/search-context";
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
    <SearchContext.Provider>
      <div className="flex w-full flex-col gap-2 p-4">
        <div className="flex gap-2">
          <SearchBar placeholder="Search channels" />
          <Auth.PrimaryButton />
        </div>
        <ChannelList />
      </div>
    </SearchContext.Provider>
  );
};
