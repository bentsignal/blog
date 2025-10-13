"use client";

import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ContextSelector,
  createContext,
  useContextSelector,
  useHasParentContext,
} from "@fluentui/react-context-selector";
import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import * as ToolTip from "./ui/tooltip";
import { cn } from "@/lib/utils";

export type PaginationStatus =
  | "LoadingFirstPage"
  | "CanLoadMore"
  | "LoadingMore"
  | "Exhausted";

export interface ListContextType {
  isAtBottom: RefObject<boolean>;
  scrollRef: RefObject<HTMLDivElement | null>;
  showScrollToBottomButton: boolean;
  setShowScrollToBottomButton: (newValue: boolean) => void;
  scrollToBottom: (behavior?: "instant" | "smooth") => void;
  loadingStatus?: PaginationStatus;
  skeletonComponent?: React.ReactNode;
  mainComposerInputRef?: RefObject<HTMLTextAreaElement | null>;
}

export const ListContext = createContext<ListContextType>(
  {} as ListContextType,
);

export const useList = <T,>(selector: ContextSelector<ListContextType, T>) =>
  useContextSelector(ListContext, selector);

interface ListProps {
  children: React.ReactNode;
  stickToBottom?: boolean;
  scrollToBottomOnMount?: boolean;
  maintainScrollPositionOnAppend?: boolean;
  loadingStatus?: PaginationStatus;
  isAtBottomThreshold?: number;
  showScrollToBottomButtonThreshold?: number;
  skeletonComponent?: React.ReactNode;
  loadMoreOnScrollThreshold?: number;
  loadMore?: () => void;
  mainComposerInputRef?: RefObject<HTMLTextAreaElement | null>;
}

export const Provider = ({
  children,
  stickToBottom,
  scrollToBottomOnMount,
  maintainScrollPositionOnAppend,
  loadingStatus,
  isAtBottomThreshold = 10,
  showScrollToBottomButtonThreshold = 500,
  loadMoreOnScrollThreshold = 1500,
  skeletonComponent,
  loadMore,
  mainComposerInputRef,
}: ListProps) => {
  const isAtBottom = useRef(false);
  const distanceFromBottom = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);

  const scrollToBottom = (behavior: "instant" | "smooth" = "instant") => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
      behavior,
    });
  };

  // handle scroll events (determine if user is at bottom, load more items when close to top of list)
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const handleScroll = () => {
        const totalHeight = scrollElement.scrollHeight;
        const windowHeight = scrollElement.clientHeight;
        const distanceFromTop = scrollElement.scrollTop;
        distanceFromBottom.current =
          totalHeight - windowHeight - distanceFromTop;
        if (
          distanceFromTop < loadMoreOnScrollThreshold &&
          loadMore &&
          loadingStatus === "CanLoadMore"
        ) {
          loadMore();
        }
        isAtBottom.current = distanceFromBottom.current <= isAtBottomThreshold;
        setShowScrollToBottomButton(
          distanceFromBottom.current >= showScrollToBottomButtonThreshold,
        );
      };
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    children,
    isAtBottomThreshold,
    showScrollToBottomButtonThreshold,
    loadMore,
    loadingStatus,
    loadMoreOnScrollThreshold,
  ]);

  // when new content is loaded and appended to the top of the list, retain previous distance from bottom
  useEffect(() => {
    if (
      !isAtBottom.current &&
      children &&
      scrollRef.current &&
      maintainScrollPositionOnAppend
    ) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight -
        scrollRef.current.clientHeight -
        distanceFromBottom.current;
    }
  }, [children, maintainScrollPositionOnAppend]);

  // when user is at the bottom of the list and the content change, scroll to the new bottom
  useEffect(() => {
    if (isAtBottom.current && children && stickToBottom) {
      scrollToBottom();
    }
  }, [children, stickToBottom]);

  // scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (scrollToBottomOnMount) {
      scrollToBottom();
    }
  }, [scrollToBottomOnMount]);

  const contextValue = useMemo(
    () => ({
      isAtBottom,
      scrollRef,
      showScrollToBottomButton,
      setShowScrollToBottomButton,
      scrollToBottom,
      loadingStatus,
      skeletonComponent,
      mainComposerInputRef,
    }),
    [
      showScrollToBottomButton,
      setShowScrollToBottomButton,
      loadingStatus,
      skeletonComponent,
      mainComposerInputRef,
    ],
  );

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
};

export const Frame = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col overflow-y-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Skeleton = () => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const skeletonComponent = useList((c) => c.skeletonComponent);
  const loadingStatus = useList((c) => c.loadingStatus);

  const showSkeleton =
    loadingStatus && skeletonComponent && loadingStatus !== "Exhausted";

  if (!showSkeleton) return null;

  return (
    <div className="mt-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>{skeletonComponent}</div>
      ))}
    </div>
  );
};

export const Content = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const scrollRef = useList((c) => c.scrollRef);

  return (
    <div
      className={cn(
        "overflow-y-auto overscroll-contain",
        "scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent",
        "mask-t-from-97% mask-b-from-97%",
        "align-start flex min-h-0 flex-1 flex-col justify-start",
        className,
      )}
      ref={scrollRef}
    >
      <Skeleton />
      {children}
    </div>
  );
};

export const ScrollToBottomButton = () => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const showScrollToBottomButton = useList((c) => c.showScrollToBottomButton);
  const scrollToBottom = useList((c) => c.scrollToBottom);

  if (!showScrollToBottomButton) return null;

  return (
    <div className="absolute right-0 bottom-0 flex justify-end p-4">
      <ToolTip.Tooltip>
        <ToolTip.TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown className="size-4" />
          </Button>
        </ToolTip.TooltipTrigger>
        <ToolTip.TooltipContent>Scroll to bottom</ToolTip.TooltipContent>
      </ToolTip.Tooltip>
    </div>
  );
};
