"use client";

import { Fragment, RefObject, useMemo, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import { PaginationStatus, usePaginatedQuery } from "convex/react";
import { toast } from "sonner";
import * as Auth from "@/components/auth";
import { useAuth } from "@/components/auth";
import * as Composer from "@/components/composer";
import { DateMarker } from "@/components/date-marker";
import * as List from "@/components/list";
import { ListContext, useList } from "@/components/list";
import * as Message from "@/components/message";
import * as CFG from "@/lib/config";
import { areSameDay } from "@/lib/time";
import { validateMessage } from "@/lib/utils";
import { useMessageActions } from "@/hooks/use-message-actions";

type ChannelProps = {
  channel: Doc<"channels">;
};

interface ChannelContextType extends ChannelProps {
  channelComposerInputRef: RefObject<HTMLTextAreaElement | null>;
  messages: Message.Message[];
  loadingStatus: PaginationStatus;
  loadMoreMessages: () => void;
}

export const ChannelContext = createContext<ChannelContextType>(
  {} as ChannelContextType,
);

export const useChannel = <T,>(
  selector: ContextSelector<ChannelContextType, T>,
) => useContextSelector(ChannelContext, selector);

export const Provider = ({
  channel,
  children,
}: ChannelProps & {
  children: React.ReactNode;
}) => {
  const channelComposerInputRef = useRef<HTMLTextAreaElement>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.get,
    { channel: channel._id },
    {
      initialNumItems: CFG.INITIAL_MESSAGE_PAGE_SIZE,
    },
  );

  const contextValue = useMemo(
    () => ({
      channel,
      channelComposerInputRef,
      loadingStatus: status,
      loadMoreMessages: () => loadMore(CFG.MESSAGE_PAGE_SIZE),
      messages: results.slice().reverse(),
    }),
    [channel, channelComposerInputRef, results, status, loadMore],
  );

  return (
    <ChannelContext.Provider value={contextValue}>
      {children}
    </ChannelContext.Provider>
  );
};

export const Header = () => {
  const signedIn = useAuth((c) => c.signedIn);
  const channel = useChannel((c) => c.channel);
  return (
    <div className="bg-muted m-4 mb-0 flex items-center justify-between rounded-2xl p-3">
      <div className="flex flex-1 items-center gap-3 pl-1">
        <span className="text-3xl font-semibold">#</span>
        <div className="flex flex-1 flex-col justify-center">
          <span className="text-sm font-bold">{channel.name}</span>
          <span className="text-muted-foreground text-xs">Text Channel</span>
        </div>
      </div>
      {signedIn ? <Auth.ProfileButton /> : <Auth.SignInButton />}
    </div>
  );
};

export const Body = () => {
  const loadingStatus = useChannel((c) => c.loadingStatus);
  const channelComposerInputRef = useChannel((c) => c.channelComposerInputRef);
  const loadMoreMessages = useChannel((c) => c.loadMoreMessages);

  if (loadingStatus === "LoadingFirstPage") {
    return <Skeleton />;
  }

  return (
    <List.Provider
      stickToBottom={true}
      scrollToBottomOnMount={true}
      maintainScrollPositionOnAppend={true}
      loadingStatus={loadingStatus}
      skeletonComponent={<Message.Skeleton />}
      loadMore={loadMoreMessages}
      mainComposerInputRef={channelComposerInputRef}
    >
      <Messages />
      <ChannelComposer />
    </List.Provider>
  );
};

const Skeleton = () => {
  return (
    <List.Provider>
      <List.Frame>
        <List.Content className="py-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Message.Skeleton key={index} index={index} />
          ))}
        </List.Content>
      </List.Frame>
      <ChannelComposer />
    </List.Provider>
  );
};

const Messages = () => {
  const messages = useChannel((c) => c.messages);
  return (
    <List.Frame>
      <List.Content className="pb-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          // messages sent by the same user within 5 minutes of each other are chained together
          const shouldChainMessages =
            previousMessage?.profile === message.profile &&
            message._creationTime - previousMessage._creationTime <
              1000 * 60 * 5;
          // if neighboring messages are not sent on the same day, show the date to mark
          // the start of a new day
          const isSameDay = areSameDay(
            message._creationTime,
            previousMessage?._creationTime ?? 0,
          );
          const showDateMarker = !isSameDay && !shouldChainMessages;
          return (
            <Fragment key={message._id}>
              {showDateMarker && <DateMarker time={message._creationTime} />}
              {message.reply ? (
                <Message.ReplyMessage message={message} />
              ) : shouldChainMessages ? (
                <Message.ChainedMessage message={message} />
              ) : (
                <Message.UserMessage message={message} />
              )}
            </Fragment>
          );
        })}
        <List.ScrollToBottomButton />
      </List.Content>
    </List.Frame>
  );
};

export const ChannelError = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1">
      <div className="text-destructive text-sm font-bold">
        Failed to load messages
      </div>
      <div className="text-muted-foreground text-xs">
        Sorry about that, something went wrong.
      </div>
    </div>
  );
};

const ChannelComposer = () => {
  const hasChannelContext = useHasParentContext(ChannelContext);
  const hasListContext = useHasParentContext(ListContext);

  if (!hasChannelContext) {
    throw new Error("ChannelContext not found");
  }
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const [inputValue, setInputValue] = useState("");

  const channel = useChannel((c) => c.channel);
  const composerInputRef = useChannel((c) => c.channelComposerInputRef);
  const signedIn = useAuth((c) => c.signedIn);
  const signIn = useAuth((c) => c.signIn);
  const scrollToBottom = useList((c) => c.scrollToBottom);

  const { sendMessage } = useMessageActions();

  const onSubmit = async () => {
    if (!signedIn) {
      await signIn();
      return;
    }
    const value = composerInputRef.current?.value ?? "";
    const validation = validateMessage(value);
    if (validation !== "Valid") {
      toast.error(validation);
      return;
    }
    setInputValue("");
    sendMessage({
      content: value,
      channel: channel._id,
    });
    if (composerInputRef.current) {
      composerInputRef.current.style.height = "auto";
    }
    setTimeout(() => {
      scrollToBottom();
    }, 0);
  };

  return (
    <Composer.Provider
      onSubmit={onSubmit}
      inputValue={inputValue}
      setInputValue={setInputValue}
      inputRef={composerInputRef}
    >
      <Composer.Frame className="mx-4 mb-4">
        <Composer.Input className="ml-1" />
        <Composer.Send />
      </Composer.Frame>
    </Composer.Provider>
  );
};
