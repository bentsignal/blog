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
  bodyRef: RefObject<HTMLDivElement | null>;
  scrollToBottom: (behavior?: "instant" | "smooth") => void;
  scrollToTop: (behavior?: "instant" | "smooth") => void;
  vagueScrollPosition: VagueScrollPosition;
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  contentFitsInContainer: boolean;
  percentToBottom: number;
  topSkeletonContainerRef: RefObject<HTMLDivElement | null>;
  bottomSkeletonContainerRef: RefObject<HTMLDivElement | null>;
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
  keepScrollPositionWhenContentChanges?: boolean;
  loadingStatus?: PaginationStatus;
  nearTopOrBottomThreshold?: number;
  skeletonComponent?: ReactNode;
  loadMoreWhenThisCloseToTop?: number;
  loadMore?: () => void;
  contentVersion?: number;
}

export const Provider = ({
  children,
  isBottomSticky,
  startAt = "top",
  keepScrollPositionWhenContentChanges,
  loadingStatus,
  nearTopOrBottomThreshold = 10, // px
  loadMoreWhenThisCloseToTop = 700, // px
  skeletonComponent,
  loadMore,
  contentVersion,
}: ListProps) => {
  const distanceFromBottomRef = useRef(0); // px

  // body is what is scrolled, contains the content and optional skeletons
  const bodyRef = useRef<HTMLDivElement>(null);
  // optional, to put skeletons on top or below content (or both)
  const topSkeletonContainerRef = useRef<HTMLDivElement>(null);
  const bottomSkeletonContainerRef = useRef<HTMLDivElement>(null);

  // TODO: use useEffectEvent to avoid this (after upgrading to React 19.2+)
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

  const [contentFitsInContainer, setContentFitsInContainer] = useState(true);

  const scrollToBottom = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      // scroll to the bottom of the content, but just above the bottom skeletons (if they exist)
      const heightOfBody = bodyRef.current?.scrollHeight ?? 0;
      const heightOfContainer = bodyRef.current?.clientHeight ?? 0;
      const heightOfBottomSkeletons =
        bottomSkeletonContainerRef.current?.clientHeight ?? 0;
      bodyRef.current?.scrollTo({
        top: heightOfBody - heightOfContainer - heightOfBottomSkeletons,
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
      bodyRef.current?.scrollTo({
        top: heightOfTopSkeletons,
        behavior,
      });
    },
    [],
  );

  // handle scroll events (determine if user is at bottom, load more items when close to top of list)
  useEffect(() => {
    const bodyContainer = bodyRef.current;
    const topSkeletonContainer = topSkeletonContainerRef.current;
    const bottomSkeletonContainer = bottomSkeletonContainerRef.current;

    if (!bodyContainer) return;

    const handleScroll = () => {
      const heightOfBody = bodyContainer.scrollHeight;
      const heightOfContainer = bodyContainer.clientHeight;
      const heightOfTopSkeletons = topSkeletonContainer?.clientHeight ?? 0;
      const heightOfBottomSkeletons =
        bottomSkeletonContainer?.clientHeight ?? 0;
      const heightOfContent =
        heightOfBody - heightOfTopSkeletons - heightOfBottomSkeletons;

      const distanceFromTop = bodyContainer.scrollTop;
      const distanceFromTopOfContent = distanceFromTop - heightOfTopSkeletons;
      const distanceFromBottomOfContent =
        heightOfBody -
        heightOfContainer -
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

      setContentFitsInContainer(heightOfContent <= heightOfContainer);

      const newUnclampedPercentToBottom =
        (distanceFromTopOfContent / (heightOfContent - heightOfContainer)) *
        100;
      const newPercentToBottom =
        newUnclampedPercentToBottom > 100
          ? 100
          : newUnclampedPercentToBottom < 0
            ? 0
            : newUnclampedPercentToBottom;
      setPercentToBottom(newPercentToBottom);
    };

    bodyContainer.addEventListener("scroll", handleScroll);

    return () => {
      bodyContainer.removeEventListener("scroll", handleScroll);
    };
  }, [
    nearTopOrBottomThreshold,
    loadMore,
    loadMoreWhenThisCloseToTop,
    setPercentToBottom,
  ]);

  // when new content is loaded and appended to the top of the list, retain previous distance from bottom
  useEffect(() => {
    if (
      vagueScrollPositionRef.current !== "bottom" &&
      bodyRef.current &&
      keepScrollPositionWhenContentChanges
    ) {
      const heightOfBody = bodyRef.current.scrollHeight;
      const heightOfContainer = bodyRef.current.clientHeight;
      bodyRef.current.scrollTop =
        heightOfBody - heightOfContainer - distanceFromBottomRef.current;
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

  // whenever content updates, determine if the content fits in the container
  useEffect(() => {
    const heightOfBody = bodyRef.current?.scrollHeight ?? 0;
    const heightOfContainer = bodyRef.current?.clientHeight;
    const heightOfTopSkeletons =
      topSkeletonContainerRef.current?.clientHeight ?? 0;
    const heightOfBottomSkeletons =
      bottomSkeletonContainerRef.current?.clientHeight ?? 0;
    const heightOfContent =
      heightOfBody - heightOfTopSkeletons - heightOfBottomSkeletons;
    if (heightOfContent && heightOfContainer) {
      setContentFitsInContainer(heightOfContent <= heightOfContainer);
    }
  }, [contentVersion]);

  const contextValue = {
    bodyRef,
    topSkeletonContainerRef,
    bottomSkeletonContainerRef,
    scrollToBottom,
    scrollToTop,
    loadingStatus,
    skeletonComponent,
    vagueScrollPosition,
    contentFitsInContainer,
    percentToBottom,
  };

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
};
