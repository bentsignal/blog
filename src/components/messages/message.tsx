"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { ArrowDown, UserRound } from "lucide-react";
import { Button } from "../ui/button";
import { cn, getTimestamp } from "@/lib/utils";

export interface Message {
  _id: Doc<"messages">["_id"];
  _creationTime: number;
  name: string;
  pfp: string | null | undefined;
  content: string;
}

export const MessageContext = createContext<Message>({} as Message);

export const useMessage = <T,>(selector: ContextSelector<Message, T>) =>
  useContextSelector(MessageContext, selector);

export const Provider = ({
  message,
  children,
}: {
  message: Message;
  children: React.ReactNode;
}) => {
  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      name: message.name,
      pfp: message.pfp,
      content: message.content,
    }),
    [message],
  );
  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export const Frame = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex gap-2">{children}</div>;
};

export const PFP = () => {
  const pfp = useMessage((c) => c.pfp);

  const [imageState, setImageState] = useState<"loading" | "error" | "loaded">(
    "loading",
  );
  if (imageState === "error" || !pfp) {
    return (
      <div className="bg-muted flex size-10 flex-shrink-0 items-center justify-center rounded-full">
        <UserRound className="text-muted-foreground size-4" />
      </div>
    );
  }

  return (
    <img
      src={pfp}
      alt=""
      className="size-10 flex-shrink-0 rounded-full"
      onError={() => setImageState("error")}
      onLoad={() => setImageState("loaded")}
    />
  );
};

export const Body = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col">{children}</div>;
};

export const Header = () => {
  const name = useMessage((c) => c.name);
  const _creationTime = useMessage((c) => c._creationTime);
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold">{name || "Unknown"}</div>
      <div className="text-muted-foreground text-xs">
        {getTimestamp(_creationTime)}
      </div>
    </div>
  );
};

export const Content = () => {
  const content = useMessage((c) => c.content);
  return (
    <div className="text-muted-foreground text-sm font-medium">{content}</div>
  );
};

export const Skeleton = () => {
  const nameWidth = Math.random() * 40 + 20;
  const contentWidth = Math.random() * 70 + 10;
  return (
    <div className="flex animate-pulse gap-2">
      <div className="bg-muted flex size-10 flex-shrink-0 items-center justify-center rounded-full" />
      <div className="mt-1 flex w-full flex-col gap-1.5">
        <div
          className="bg-muted-foreground/10 h-3 rounded-md"
          style={{
            width: nameWidth + "%",
          }}
        />
        <div
          className="bg-muted-foreground/10 h-3 rounded-md"
          style={{
            width: contentWidth + "%",
          }}
        />
      </div>
    </div>
  );
};

export const List = ({
  autoScroll = false,
  className,
  children,
}: {
  autoScroll?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);

  // determine if user is at the bottom of the list
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", () => {
        const totalHeight = scrollElement.scrollHeight;
        const windowHeight = scrollElement.clientHeight;
        const distanceFromTop = scrollElement.scrollTop;
        const distanceFromBottom = totalHeight - windowHeight - distanceFromTop;
        isAtBottom.current = distanceFromBottom <= 100;
        setShowScrollToBottomButton(distanceFromBottom >= 500);
      });
      return () => {
        scrollElement.removeEventListener("scroll", () => {});
      };
    }
  }, [children]);

  // when user is at bottom and a new message comes in, scroll to the bottom
  useEffect(() => {
    if (isAtBottom.current && children && autoScroll) {
      bottomRef.current?.scrollIntoView();
    }
  }, [children, autoScroll]);

  // scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView();
    }
  }, [autoScroll]);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-hidden">
      <div
        className={cn(
          "align-start scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent flex min-h-0 flex-1 flex-col justify-start gap-3 overflow-y-auto overscroll-contain mask-t-from-97% mask-b-from-97% px-4 pt-3 pb-3",
          className,
        )}
        ref={scrollRef}
      >
        {children}
        {showScrollToBottomButton && (
          <div className="absolute right-3 bottom-3 flex justify-end">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                bottomRef.current?.scrollIntoView();
              }}
            >
              <ArrowDown className="size-4" />
            </Button>
          </div>
        )}
        <div ref={bottomRef} className="w-full" />
      </div>
    </div>
  );
};

export const Error = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1">
      <div className="text-destructive text-sm font-bold">
        Failed to load messages
      </div>
      <div className="text-muted-foreground text-xs">
        Sorry about that, something went wrong. Please check back later.
      </div>
    </div>
  );
};
