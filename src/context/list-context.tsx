"use client";

import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { VagueScrollPosition } from "@/types/list-types";
import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import { type PaginationStatus } from "convex/react";

export interface ListContextType {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollToBottom: (behavior?: "instant" | "smooth") => void;
  scrollToTop: (behavior?: "instant" | "smooth") => void;
  vagueScrollPosition: VagueScrollPosition;
  loadingStatus?: PaginationStatus;
  skeletonComponent?: React.ReactNode;
  composerInputRef?: RefObject<HTMLTextAreaElement | null>;
}

export const ListContext = createContext<ListContextType>(
  {} as ListContextType,
);

export const useList = <T,>(selector: ContextSelector<ListContextType, T>) =>
  useContextSelector(ListContext, selector);

interface ListProps {
  children: React.ReactNode;
  stickToBottom?: boolean;
  startAt?: "bottom" | "top";
  maintainScrollOnContentChange?: boolean;
  loadingStatus?: PaginationStatus;
  isNearBoundaryThreshold?: number;
  skeletonComponent?: React.ReactNode;
  loadMoreOnScrollThreshold?: number;
  loadMore?: () => void;
  composerInputRef?: RefObject<HTMLTextAreaElement | null>;
  contentVersion?: number;
}

export const Provider = ({
  children,
  stickToBottom,
  startAt = "top",
  maintainScrollOnContentChange,
  loadingStatus,
  isNearBoundaryThreshold = 10,
  loadMoreOnScrollThreshold = 1500,
  skeletonComponent,
  loadMore,
  composerInputRef,
  contentVersion,
}: ListProps) => {
  const distanceFromBottom = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const vagueScrollPositionRef = useRef<VagueScrollPosition>(
    startAt === "bottom" ? "bottom" : "top",
  );

  const [vagueScrollPosition, setVagueScrollPosition] =
    useState<VagueScrollPosition>(startAt === "bottom" ? "bottom" : "top");

  const scrollToBottom = (behavior: "instant" | "smooth" = "instant") => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
      behavior,
    });
  };

  const scrollToTop = (behavior: "instant" | "smooth" = "instant") => {
    scrollRef.current?.scrollTo({
      top: 0,
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
        const newDistanceFromTop = scrollElement.scrollTop;
        const newDistanceFromBottom =
          totalHeight - windowHeight - newDistanceFromTop;
        distanceFromBottom.current = newDistanceFromBottom;
        if (
          newDistanceFromBottom < loadMoreOnScrollThreshold &&
          loadMore &&
          loadingStatus === "CanLoadMore"
        ) {
          loadMore();
        }
        const newVagueScrollPosition =
          newDistanceFromTop <= isNearBoundaryThreshold
            ? "top"
            : newDistanceFromBottom <= isNearBoundaryThreshold
              ? "bottom"
              : "middle";
        vagueScrollPositionRef.current = newVagueScrollPosition;
        setVagueScrollPosition(newVagueScrollPosition);
      };
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    isNearBoundaryThreshold,
    loadMore,
    loadingStatus,
    loadMoreOnScrollThreshold,
  ]);

  // when new content is loaded and appended to the top of the list, retain previous distance from bottom
  useEffect(() => {
    if (
      vagueScrollPositionRef.current !== "bottom" &&
      scrollRef.current &&
      maintainScrollOnContentChange
    ) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight -
        scrollRef.current.clientHeight -
        distanceFromBottom.current;
    }
  }, [contentVersion, maintainScrollOnContentChange]);

  // when user is at the bottom of the list and the content changes, scroll to the new bottom
  useEffect(() => {
    if (vagueScrollPositionRef.current === "bottom" && stickToBottom) {
      scrollToBottom();
    }
  }, [contentVersion, stickToBottom]);

  // optionally scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (startAt === "bottom") {
      scrollToBottom();
    }
  }, [startAt]);

  const contextValue = useMemo(
    () => ({
      scrollRef,
      scrollToBottom,
      scrollToTop,
      loadingStatus,
      skeletonComponent,
      composerInputRef,
      vagueScrollPosition,
    }),
    [loadingStatus, skeletonComponent, composerInputRef, vagueScrollPosition],
  );

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
};
