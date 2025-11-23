"use client";

import { SearchBar } from "./search-bar";
import { TopControls } from "./top-controls";
import { ChannelList } from "@/molecules/channel-list";

export const ChannelBrowser = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <TopControls className="md:hidden" />
      <div className="bg-muted mx-4 flex rounded-2xl p-3 md:mt-4">
        <SearchBar placeholder="Search" />
      </div>
      <ChannelList />
    </div>
  );
};
