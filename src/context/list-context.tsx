"use client";

import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
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
  contentFitsInWindow: boolean;
  percentToBottom: number;
}

export const ListContext = createContext<ListContextType>(
  {} as ListContextType,
);

export const useList = <T,>(selector: ContextSelector<ListContextType, T>) =>
  useContextSelector(ListContext, selector);

interface ListProps {
  children: React.ReactNode;
  isBottomSticky?: boolean;
  startAt?: "bottom" | "top";
  keepScrollPositionWhenContentChanges?: boolean;
  loadingStatus?: PaginationStatus;
  nearBoundaryThreshold?: number;
  skeletonComponent?: React.ReactNode;
  loadMoreOnScrollThreshold?: number;
  loadMore?: () => void;
  contentVersion?: number;
}

export const Provider = ({
  children,
  isBottomSticky,
  startAt = "top",
  keepScrollPositionWhenContentChanges,
  loadingStatus,
  nearBoundaryThreshold = 10,
  loadMoreOnScrollThreshold = 1500,
  skeletonComponent,
  loadMore,
  contentVersion,
}: ListProps) => {
  const distanceFromBottom = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // avoid re mounting scroll listener ever time loading status changes
  // TODO: use useEffectEvent to avoid this ( after upgrading to React 19.2+)
  const loadingStatusRef = useRef(loadingStatus);
  loadingStatusRef.current = loadingStatus;

  const [percentToBottom, setPercentToBottom] = useState(
    startAt === "bottom" ? 100 : 0,
  );

  const [vagueScrollPosition, setVagueScrollPosition] =
    useState<VagueScrollPosition>(startAt === "bottom" ? "bottom" : "top");
  const vagueScrollPositionRef = useRef<VagueScrollPosition>(
    startAt === "bottom" ? "bottom" : "top",
  );

  const [contentFitsInWindow, setContentFitsInWindow] = useState(true);

  const scrollToBottom = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current?.scrollHeight,
        behavior,
      });
    },
    [],
  );

  const scrollToTop = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      scrollRef.current?.scrollTo({
        top: 0,
        behavior,
      });
    },
    [],
  );

  // handle scroll events (determine if user is at bottom, load more items when close to top of list)
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const handleScroll = () => {
        const totalHeight = scrollElement.scrollHeight;
        const windowHeight = scrollElement.clientHeight;
        const newDistanceFromTop = scrollElement.scrollTop;
        const scrollableDistance = totalHeight - windowHeight;
        const newDistanceFromBottom = scrollableDistance - newDistanceFromTop;
        distanceFromBottom.current = newDistanceFromBottom;
        if (
          newDistanceFromTop < loadMoreOnScrollThreshold &&
          loadMore &&
          loadingStatusRef.current === "CanLoadMore"
        ) {
          loadMore();
        }
        const newVagueScrollPosition =
          newDistanceFromTop <= nearBoundaryThreshold
            ? "top"
            : newDistanceFromBottom <= nearBoundaryThreshold
              ? "bottom"
              : "middle";
        vagueScrollPositionRef.current = newVagueScrollPosition;
        setVagueScrollPosition(newVagueScrollPosition);
        setContentFitsInWindow(totalHeight <= windowHeight);
        setPercentToBottom(
          scrollableDistance > 0
            ? (newDistanceFromTop / scrollableDistance) * 100
            : 100,
        );
      };
      scrollElement.addEventListener("scroll", handleScroll);
      return () => {
        scrollElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [
    nearBoundaryThreshold,
    loadMore,
    loadMoreOnScrollThreshold,
    setPercentToBottom,
  ]);

  // when new content is loaded and appended to the top of the list, retain previous distance from bottom
  useEffect(() => {
    if (
      vagueScrollPositionRef.current !== "bottom" &&
      scrollRef.current &&
      keepScrollPositionWhenContentChanges
    ) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight -
        scrollRef.current.clientHeight -
        distanceFromBottom.current;
    }
  }, [contentVersion, keepScrollPositionWhenContentChanges]);

  // when user is at the bottom of the list and the content changes, scroll to the new bottom
  useEffect(() => {
    if (vagueScrollPositionRef.current === "bottom" && isBottomSticky) {
      scrollToBottom();
    }
  }, [contentVersion, isBottomSticky, scrollToBottom]);

  // optionally scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (startAt === "bottom") {
      scrollToBottom();
    }
  }, [startAt, scrollToBottom]);

  // whenever content updates, determine if the content fits in the window
  useEffect(() => {
    const windowHeight = scrollRef.current?.clientHeight;
    const totalHeight = scrollRef.current?.scrollHeight;
    if (totalHeight && windowHeight) {
      setContentFitsInWindow(totalHeight <= windowHeight);
    }
  }, [contentVersion]);

  const contextValue = {
    scrollRef,
    scrollToBottom,
    scrollToTop,
    loadingStatus,
    skeletonComponent,
    vagueScrollPosition,
    contentFitsInWindow,
    percentToBottom,
  };

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
};
