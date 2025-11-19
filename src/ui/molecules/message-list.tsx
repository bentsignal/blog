import { Fragment } from "react";
import { type EnhancedMessage } from "@/types/message-types";
import { cn } from "@/utils/style-utils";
import { areSameDay } from "@/utils/time-utils";
import * as List from "@/ui/atoms/list";
import * as Message from "@/ui/atoms/message";
import { DateMarker } from "@/ui/molecules/date-marker";
import {
  ChainedMessage,
  ReplyMessage,
  StandardMessage,
} from "@/ui/molecules/messages";

export const MessageList = ({ messages }: { messages: EnhancedMessage[] }) => {
  if (messages.length === 0) {
    return (
      <List.Frame>
        <div className="flex flex-1 flex-col justify-end overflow-hidden mask-t-from-95%">
          {Array.from({ length: 30 }).map((_, index) => (
            <Message.Skeleton key={index} index={index} animate={false} />
          ))}
        </div>
        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
          <div
            className={cn(
              "flex h-[50%] w-full flex-col items-center justify-center gap-1",
              "bg-background/10 mask-t-from-75% mask-b-from-75% backdrop-blur-xs",
              "animate-in fade-in blur-in duration-500",
            )}
          >
            <span className="text-xl font-bold">
              No one's said anything yet
            </span>
            <span className="text-muted-foreground text-lg">
              Get the ball rolling! ⬇️
            </span>
          </div>
        </div>
      </List.Frame>
    );
  }
  return (
    <List.Frame>
      <List.Container fade="sm">
        <List.Skeletons position="aboveContent" className="pt-4" />
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
                  <ReplyMessage message={message} />
                ) : shouldChainMessages ? (
                  <ChainedMessage message={message} />
                ) : (
                  <StandardMessage message={message} />
                )}
              </Fragment>
            );
          })}
        </List.Content>
      </List.Container>
      <List.ScrollToBottomButton
        className="absolute right-0 bottom-0 z-6 p-4"
        hideWhenAtBottom={true}
      />
    </List.Frame>
  );
};
