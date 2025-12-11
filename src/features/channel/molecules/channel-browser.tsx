"use client";

import { SearchBar } from "@/features/search/molecules/search-bar";
import { ChannelList } from "./channel-list";
import { TopControls } from "@/molecules/top-controls";

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
