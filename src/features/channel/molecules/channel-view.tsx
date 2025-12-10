"use client";

import { type ChannelSlug } from "@/data/channels";
import * as Channel from "@/features/channel/atom";
import { TopControls } from "@/molecules/top-controls";

const ChannelView = ({ slug }: { slug: ChannelSlug }) => {
  return (
    <Channel.Provider slug={slug}>
      <div className="flex h-full w-full flex-col">
        <TopControls className="md:hidden" />
        <Channel.Header />
        <Channel.Body />
      </div>
    </Channel.Provider>
  );
};

export { ChannelView };
