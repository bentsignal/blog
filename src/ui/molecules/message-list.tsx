import { Fragment } from "react";
import { type EnhancedMessage } from "@/types/message-types";
import { areSameDay } from "@/utils/time-utils";
import * as List from "@/ui/atoms/list";
import { DateMarker } from "@/ui/molecules/date-marker";
import {
  ChainedMessage,
  ReplyMessage,
  StandardMessage,
} from "@/ui/molecules/messages";

export const MessageList = ({ messages }: { messages: EnhancedMessage[] }) => {
  return (
    <List.Frame>
      <List.Body fade="sm">
        <List.Skeletons position="aboveContent" className="pt-4" />
        <div className="pb-4">
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
        </div>
      </List.Body>
      <List.ScrollToBottomButton
        className="absolute right-0 bottom-0 z-6 p-4"
        hideWhenAtBottom={true}
      />
    </List.Frame>
  );
};
