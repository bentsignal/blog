"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { ArrowDown, UserRound } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import {
  cn,
  getFullTimestamp,
  getTimeString,
  isOverOneDayAgo,
} from "@/lib/utils";

export interface Message {
  _id: Doc<"messages">["_id"];
  _creationTime: number;
  name: string;
  pfp: string | null | undefined;
  snapshots: {
    content: string;
    timestamp: number;
  }[];
}

interface MessageContextType extends Message {
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
}

export const MessageContext = createContext<MessageContextType>(
  {} as MessageContextType,
);

export const useMessage = <T,>(
  selector: ContextSelector<MessageContextType, T>,
) => useContextSelector(MessageContext, selector);

export const Provider = ({
  message,
  children,
}: {
  message: Message;
  children: React.ReactNode;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const contextValue = useMemo(
    () => ({
      _id: message._id,
      _creationTime: message._creationTime,
      name: message.name,
      pfp: message.pfp,
      snapshots: message.snapshots,
      isHovering,
      setIsHovering,
    }),
    [message, isHovering, setIsHovering],
  );
  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

export const Frame = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const setIsHovering = useMessage((c) => c.setIsHovering);
  return (
    <div
      className={cn("hover:bg-muted flex gap-3 px-6 py-0.5", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
    </div>
  );
};

export const PFP = () => {
  const pfp = useMessage((c) => c.pfp);

  const [imageState, setImageState] = useState<"loading" | "error" | "loaded">(
    "loading",
  );

  if (imageState === "error" || !pfp) {
    return (
      <SkeletonPFP>
        <UserRound className="text-muted-foreground size-4" />
      </SkeletonPFP>
    );
  }

  return (
    <Image
      src={pfp}
      alt=""
      width={40}
      height={40}
      className="size-10 flex-shrink-0 rounded-full"
      onError={() => setImageState("error")}
      onLoad={() => setImageState("loaded")}
    />
  );
};

export const Body = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};

export const Time = ({ time }: { time: string }) => {
  return <div className="text-muted-foreground text-xxs">{time}</div>;
};

export const Header = () => {
  const name = useMessage((c) => c.name);

  const _creationTime = useMessage((c) => c._creationTime);
  const timeStamp = isOverOneDayAgo(_creationTime)
    ? getFullTimestamp(_creationTime)
    : getTimeString(_creationTime);

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold">{name || "Unknown"}</div>
      <Time time={timeStamp} />
    </div>
  );
};

export const Content = () => {
  const snapshots = useMessage((c) => c.snapshots);
  return (
    <span className="text-muted-foreground text-sm font-medium">
      {snapshots[snapshots.length - 1].content}
      {snapshots?.length && snapshots.length > 1 && (
        <span className="text-muted-foreground/50 text-xxs ml-1 font-light">
          (edited)
        </span>
      )}
    </span>
  );
};

export const SkeletonPFP = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-muted flex size-10 flex-shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const SkeletonBar = ({ width }: { width: number }) => {
  return (
    <div
      className="bg-muted-foreground/10 h-3 rounded-md"
      style={{ width: `${width}%` }}
    />
  );
};

export const Skeleton = () => {
  const nameWidth = Math.random() * 40 + 20;
  const contentWidth = Math.random() * 70 + 10;
  return (
    <Frame className="mb-3 animate-pulse">
      <SkeletonPFP />
      <div className="mt-1 flex w-full flex-col gap-1.5">
        <SkeletonBar width={nameWidth} />
        <SkeletonBar width={contentWidth} />
      </div>
    </Frame>
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottom = useRef(false);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
      behavior: "instant",
    });
  };

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
      scrollToBottom();
    }
  }, [children, autoScroll]);

  // scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [autoScroll]);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-hidden">
      <div
        className={cn(
          "align-start flex min-h-0 flex-1 flex-col justify-start pt-3 pb-3",
          "overflow-y-auto overscroll-contain",
          "scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent",
          "mask-t-from-97% mask-b-from-97%",
          className,
        )}
        ref={scrollRef}
      >
        {children}
        {showScrollToBottomButton && (
          <div className="absolute right-3 bottom-3 flex justify-end">
            <Button variant="outline" size="icon" onClick={scrollToBottom}>
              <ArrowDown className="size-4" />
            </Button>
          </div>
        )}
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

export const SideTime = () => {
  const isHovering = useMessage((c) => c.isHovering);
  const time = useMessage((c) => c._creationTime);
  return (
    <div className="w-13 flex-shrink-0">
      {isHovering && <Time time={getTimeString(time)} />}
    </div>
  );
};
