import type { ChannelSlug } from "@/blog/channels";
import * as Channel from "@/features/channel/atom";
import { ChannelBody } from "./channel-body";
import { TopControls } from "@/molecules/top-controls";

const ChannelView = ({ slug }: { slug: ChannelSlug }) => {
  return (
    <Channel.Provider slug={slug}>
      <div className="flex h-full w-full flex-col">
        <TopControls className="md:hidden" />
        <div className="bg-muted mx-4 flex items-center justify-between rounded-2xl p-3 pl-2 md:mt-4">
          <div className="flex flex-1 items-center gap-2 pl-1">
            <Channel.BackButton />
            <Channel.Identifier />
          </div>
        </div>
        <ChannelBody />
      </div>
    </Channel.Provider>
  );
};

export { ChannelView };
