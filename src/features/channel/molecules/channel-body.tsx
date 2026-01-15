"use client";

import * as Channel from "@/features/channel/atom";
import { ChannelComposer } from "@/features/composer/molecules/channel-composer";
import * as Message from "@/features/messages/atom";
import { MessageList } from "@/features/messages/molecules/message-list";
import * as List from "@/atoms/list";
import * as Scroll from "@/atoms/scroll";

const Skeletons = () => {
  return (
    <Scroll.Store>
      <Scroll.Wrapper>
        <div className="flex flex-1 flex-col justify-end overflow-hidden mask-t-from-95%">
          {Array.from({ length: 30 }).map((_, index) => (
            <Message.Skeleton key={index} index={index} />
          ))}
        </div>
      </Scroll.Wrapper>
      <ChannelComposer />
    </Scroll.Store>
  );
};

const ChannelBody = () => {
  const loadingStatus = Channel.useStore((s) => s.loadingStatus);
  const loadMoreMessages = Channel.useStore((s) => s.loadMoreMessages);
  const messages = Channel.useStore((s) => s.messages);
  const numberOfPages = Channel.useStore((s) => s.numberOfPages);

  if (loadingStatus === "LoadingFirstPage") return <Skeletons />;

  return (
    <Scroll.Store startAt="bottom">
      <List.Store
        isBottomSticky={true}
        loadingStatus={loadingStatus}
        skeletonComponent={<Message.Skeleton />}
        loadMore={loadMoreMessages}
        numberOfPages={numberOfPages}
      >
        <MessageList messages={messages} />
        <ChannelComposer />
      </List.Store>
    </Scroll.Store>
  );
};

export { ChannelBody };
