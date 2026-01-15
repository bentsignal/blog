"use client";

import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { createStore } from "rostra";
import type { PaginationStatus } from "convex/react";
import { createContext, useRequiredContext } from "@/lib/context";
import * as Scroll from "@/atoms/scroll";

type StoreProps = {
  isBottomSticky?: boolean;
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  loadMore?: () => void;
  loadMoreWhenThisCloseToTop?: number;
  numberOfPages?: number;
};

type StoreType = {
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  topSkeletonContainerRef: RefObject<HTMLDivElement | null>;
  bottomSkeletonContainerRef: RefObject<HTMLDivElement | null>;
};

function useInternalStore({
  isBottomSticky,
  loadingStatus,
  loadMoreWhenThisCloseToTop = 700, // px
  skeletonComponent,
  loadMore,
  numberOfPages,
}: StoreProps) {
  const getScrollMeasurements = Scroll.useStore((s) => s.getScrollMeasurements);
  const scrollToBottom = Scroll.useStore((s) => s.scrollToBottom);
  const scrollToTop = Scroll.useStore((s) => s.scrollToTop);
  const containerRef = Scroll.useStore((s) => s.containerRef);
  const contentRef = Scroll.useStore((s) => s.contentRef);
  const vagueScrollPositionRef = Scroll.useStore(
    (s) => s.vagueScrollPositionRef,
  );
  const setContentFitsInContainer = Scroll.useStore(
    (s) => s.setContentFitsInContainer,
  );

  // optional, to put skeletons on top or below content (or both)
  const topSkeletonContainerRef = useRef<HTMLDivElement>(null);
  const bottomSkeletonContainerRef = useRef<HTMLDivElement>(null);

  const loadingStatusRef = useRef(loadingStatus);
  const numberOfPagesRef = useRef(numberOfPages);

  useLayoutEffect(() => {
    loadingStatusRef.current = loadingStatus;
    numberOfPagesRef.current = numberOfPages;
  }, [numberOfPages, loadingStatus]);

  const getListMeasurements = useCallback(() => {
    const scrollMeasurements = getScrollMeasurements();
    const { heightOfContainer, heightOfScrollWindow, distanceFromTop } =
      scrollMeasurements;

    const heightOfTopSkeletons =
      topSkeletonContainerRef.current?.clientHeight ?? 0;
    const heightOfBottomSkeletons =
      bottomSkeletonContainerRef.current?.clientHeight ?? 0;

    const distanceFromTopOfContent = distanceFromTop - heightOfTopSkeletons;
    const distanceFromBottomOfContent =
      heightOfContainer -
      heightOfScrollWindow -
      distanceFromTop -
      heightOfBottomSkeletons;

    return {
      ...scrollMeasurements,
      heightOfTopSkeletons,
      heightOfBottomSkeletons,
      distanceFromTopOfContent,
      distanceFromBottomOfContent,
    };
  }, [getScrollMeasurements]);

  const handleScroll = useCallback(() => {
    if (containerRef.current === null) return;
    if (contentRef.current === null) return;

    const { distanceFromTopOfContent } = getListMeasurements();

    const closeEnoughToLoadMore =
      distanceFromTopOfContent < loadMoreWhenThisCloseToTop;
    if (
      loadMore &&
      closeEnoughToLoadMore &&
      loadingStatusRef.current === "CanLoadMore"
    ) {
      loadMore();
    }
  }, [
    loadMore,
    loadMoreWhenThisCloseToTop,
    getListMeasurements,
    containerRef,
    contentRef,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll, containerRef, contentRef]);

  // handle updates in size of content
  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container) return;
    if (!content) return;

    let previousHeightOfContainer = container.scrollHeight;
    let previousNumberOfPages = numberOfPagesRef.current;

    const observer = new ResizeObserver(() => {
      const {
        heightOfContainer,
        heightOfScrollWindow,
        heightOfContent,
        distanceFromBottomOfContent,
      } = getListMeasurements();

      const changeInHeightOfContent = Math.abs(
        heightOfContainer - previousHeightOfContainer,
      );

      setContentFitsInContainer(heightOfContent <= heightOfScrollWindow);

      if (changeInHeightOfContent <= 0) return;

      const contentWasAddedToTopOfList =
        numberOfPagesRef.current !== previousNumberOfPages;
      const wereAtTheBottomOfTheList =
        vagueScrollPositionRef.current === "bottom";

      // maintains scroll position when content is loaded and added to the top of the list
      if (contentWasAddedToTopOfList && !wereAtTheBottomOfTheList) {
        container.scrollTop =
          heightOfContainer -
          heightOfScrollWindow -
          distanceFromBottomOfContent;
      }

      // if we're at the bottom and new content is added to the bottom, move to new bottom
      if (wereAtTheBottomOfTheList && isBottomSticky) {
        scrollToBottom();
      }

      previousNumberOfPages = numberOfPagesRef.current;
      previousHeightOfContainer = heightOfContainer;
    });

    observer.observe(content);

    return () => {
      observer.disconnect();
    };
  }, [
    isBottomSticky,
    getListMeasurements,
    scrollToBottom,
    vagueScrollPositionRef,
    containerRef,
    contentRef,
    setContentFitsInContainer,
  ]);

  return {
    topSkeletonContainerRef,
    bottomSkeletonContainerRef,
    scrollToBottom,
    scrollToTop,
    loadingStatus,
    skeletonComponent,
  };
}

export const { Store, useStore } = createStore<StoreType, StoreProps>(
  useInternalStore,
);
