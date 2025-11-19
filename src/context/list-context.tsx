"use client";

import {
  ReactNode,
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
  containerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollToBottom: (behavior?: "instant" | "smooth") => void;
  scrollToTop: (behavior?: "instant" | "smooth") => void;
  vagueScrollPosition: VagueScrollPosition;
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  contentFitsInContainer: boolean;
  percentToBottom: number;
  topSkeletonContainerRef: RefObject<HTMLDivElement | null>;
  bottomSkeletonContainerRef: RefObject<HTMLDivElement | null>;
  hasScrollBeenMeasured: boolean;
}

export const ListContext = createContext<ListContextType>(
  {} as ListContextType,
);

export const useList = <T,>(selector: ContextSelector<ListContextType, T>) =>
  useContextSelector(ListContext, selector);

interface ListProps {
  children: ReactNode;
  isBottomSticky?: boolean;
  startAt?: "bottom" | "top";
  loadingStatus?: PaginationStatus;
  nearTopOrBottomThreshold?: number;
  skeletonComponent?: ReactNode;
  loadMoreWhenThisCloseToTop?: number;
  loadMore?: () => void;
  numberOfPages?: number;
}

export const Provider = ({
  children,
  isBottomSticky,
  startAt = "top",
  loadingStatus,
  nearTopOrBottomThreshold = 10, // px
  loadMoreWhenThisCloseToTop = 700, // px
  skeletonComponent,
  loadMore,
  numberOfPages,
}: ListProps) => {
  const distanceFromBottomRef = useRef(0); // px

  // container is scrollable container that houses the content and optional top and bottom skeletons
  const containerRef = useRef<HTMLDivElement>(null);
  // content only contains the actual page content (not the skeletons)
  const contentRef = useRef<HTMLDivElement>(null);

  // optional, to put skeletons on top or below content (or both)
  const topSkeletonContainerRef = useRef<HTMLDivElement>(null);
  const bottomSkeletonContainerRef = useRef<HTMLDivElement>(null);

  // TODO: use useEffectEvent to avoid this (after upgrading to React 19.2+)
  const loadingStatusRef = useRef(loadingStatus);
  loadingStatusRef.current = loadingStatus;

  const numberOfPagesRef = useRef(numberOfPages);
  numberOfPagesRef.current = numberOfPages;

  const [percentToBottom, setPercentToBottom] = useState(
    startAt === "bottom" ? 100 : 0,
  );

  const [vagueScrollPosition, setVagueScrollPosition] =
    useState<VagueScrollPosition>(startAt === "bottom" ? "bottom" : "top");
  const vagueScrollPositionRef = useRef<VagueScrollPosition>(
    startAt === "bottom" ? "bottom" : "top",
  );

  const [contentFitsInContainer, setContentFitsInContainer] = useState(true);
  const [hasScrollBeenMeasured, setHasScrollBeenMeasured] = useState(false);

  const scrollToBottom = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      // scroll to the bottom of the content, but just above the bottom skeletons (if they exist)
      const heightOfContainer = containerRef.current?.scrollHeight ?? 0;
      const heightOfScrollWindow = containerRef.current?.clientHeight ?? 0;
      const heightOfBottomSkeletons =
        bottomSkeletonContainerRef.current?.clientHeight ?? 0;
      containerRef.current?.scrollTo({
        top: heightOfContainer - heightOfScrollWindow - heightOfBottomSkeletons,
        behavior,
      });
    },
    [],
  );

  const scrollToTop = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      // scroll to the top of the content, but just below the top skeletons (if they exist)
      const heightOfTopSkeletons =
        topSkeletonContainerRef.current?.clientHeight ?? 0;
      containerRef.current?.scrollTo({
        top: heightOfTopSkeletons,
        behavior,
      });
    },
    [],
  );

  // handle scroll events (determine if user is at bottom, load more items when close to top of list)
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    const topSkeletonContainer = topSkeletonContainerRef.current;
    const bottomSkeletonContainer = bottomSkeletonContainerRef.current;

    if (!container) return;
    if (!content) return;

    const handleScroll = () => {
      const heightOfContainer = container.scrollHeight;
      const heightOfScrollWindow = container.clientHeight;
      const heightOfTopSkeletons = topSkeletonContainer?.clientHeight ?? 0;
      const heightOfBottomSkeletons =
        bottomSkeletonContainer?.clientHeight ?? 0;
      const heightOfContent = content.clientHeight;

      const distanceFromTop = container.scrollTop;
      const distanceFromTopOfContent = distanceFromTop - heightOfTopSkeletons;
      const distanceFromBottomOfContent =
        heightOfContainer -
        heightOfScrollWindow -
        heightOfBottomSkeletons -
        distanceFromTop;
      distanceFromBottomRef.current = distanceFromBottomOfContent;

      const closeEnoughToLoadMore =
        distanceFromTopOfContent < loadMoreWhenThisCloseToTop;
      if (
        loadMore &&
        closeEnoughToLoadMore &&
        loadingStatusRef.current === "CanLoadMore"
      ) {
        loadMore();
      }

      const newVagueScrollPosition =
        distanceFromTopOfContent <= nearTopOrBottomThreshold
          ? "top"
          : distanceFromBottomOfContent <= nearTopOrBottomThreshold
            ? "bottom"
            : "middle";
      vagueScrollPositionRef.current = newVagueScrollPosition;
      setVagueScrollPosition(newVagueScrollPosition);

      setContentFitsInContainer(heightOfContent <= heightOfScrollWindow);

      const newUnclampedPercentToBottom =
        (distanceFromTopOfContent / (heightOfContent - heightOfScrollWindow)) *
        100;
      const newPercentToBottom =
        newUnclampedPercentToBottom > 100
          ? 100
          : newUnclampedPercentToBottom < 0
            ? 0
            : newUnclampedPercentToBottom;
      setPercentToBottom(newPercentToBottom);

      setHasScrollBeenMeasured(true);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [
    nearTopOrBottomThreshold,
    loadMore,
    loadMoreWhenThisCloseToTop,
    setPercentToBottom,
  ]);

  // handle updates in size of content
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container) return;
    if (!content) return;

    let previousHeightOfContainer = container.scrollHeight;
    let previousNumberOfPages = numberOfPagesRef.current;

    const observer = new ResizeObserver(() => {
      const heightofContainer = container.scrollHeight;
      const changeInHeightOfContent = Math.abs(
        heightofContainer - previousHeightOfContainer,
      );

      // check if content still fits in container
      const heightOfScrollWindow = container.clientHeight;
      const heightOfContent = content.clientHeight;
      setContentFitsInContainer(heightOfContent <= heightOfScrollWindow);

      if (changeInHeightOfContent <= 0) return;

      const contentWasAddedToTopOfList =
        numberOfPagesRef.current !== previousNumberOfPages;

      if (contentWasAddedToTopOfList) {
        // maintains scroll position when messages are loaded and added to the top of the list
        if (vagueScrollPositionRef.current !== "bottom") {
          container.scrollTop =
            heightofContainer -
            heightOfScrollWindow -
            distanceFromBottomRef.current;
        }
      } else if (
        vagueScrollPositionRef.current === "bottom" &&
        isBottomSticky
      ) {
        // stay at bottom of the list when new messages come in
        scrollToBottom();
      }

      previousNumberOfPages = numberOfPagesRef.current;
      previousHeightOfContainer = heightofContainer;
    });

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [isBottomSticky, scrollToBottom]);

  // optionally scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (startAt === "bottom") {
      scrollToBottom();
    }
  }, [startAt, scrollToBottom]);

  const contextValue = {
    containerRef,
    contentRef,
    topSkeletonContainerRef,
    bottomSkeletonContainerRef,
    scrollToBottom,
    scrollToTop,
    loadingStatus,
    skeletonComponent,
    vagueScrollPosition,
    contentFitsInContainer,
    percentToBottom,
    hasScrollBeenMeasured,
  };

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
};
