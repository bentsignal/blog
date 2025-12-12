"use client";

import { useRequiredContext } from "@/lib/context";
import * as Channel from "@/features/channel/atom";
import { ChannelComposer } from "@/features/composer/molecules/channel-composer";
import * as Message from "@/features/messages/atom";
import { MessageList } from "@/features/messages/molecules/message-list";
import * as List from "@/atoms/list";
import * as Scroll from "@/atoms/scroll";

const Skeletons = () => {
  return (
    <Scroll.Provider>
      <Scroll.Wrapper>
        <div className="flex flex-1 flex-col justify-end overflow-hidden mask-t-from-95%">
          {Array.from({ length: 30 }).map((_, index) => (
            <Message.Skeleton key={index} index={index} />
          ))}
        </div>
      </Scroll.Wrapper>
      <ChannelComposer />
    </Scroll.Provider>
  );
};

const ChannelBody = () => {
  useRequiredContext(Channel.Context);
  const loadingStatus = Channel.useContext((c) => c.loadingStatus);
  const loadMoreMessages = Channel.useContext((c) => c.loadMoreMessages);
  const messages = Channel.useContext((c) => c.messages);
  const numberOfPages = Channel.useContext((c) => c.numberOfPages);

  if (loadingStatus === "LoadingFirstPage") return <Skeletons />;

  return (
    <Scroll.Provider startAt="bottom">
      <List.Provider
        isBottomSticky={true}
        loadingStatus={loadingStatus}
        skeletonComponent={<Message.Skeleton />}
        loadMore={loadMoreMessages}
        numberOfPages={numberOfPages}
      >
        <MessageList messages={messages} />
        <ChannelComposer />
      </List.Provider>
    </Scroll.Provider>
  );
};

export { ChannelBody };
