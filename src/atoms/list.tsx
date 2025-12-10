"use client";

import {
  cloneElement,
  isValidElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { cn } from "@/utils/style-utils";
import { type PaginationStatus } from "convex/react";
import { ScrollContext, useScroll } from "./scroll";
import { createContext, useRequiredContext } from "@/lib/context";

export const { Context: ListContext, use: useList } = createContext<{
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  topSkeletonContainerRef: RefObject<HTMLDivElement | null>;
  bottomSkeletonContainerRef: RefObject<HTMLDivElement | null>;
}>({ displayName: "ListContext" });

export const Provider = ({
  children,
  isBottomSticky,
  loadingStatus,
  loadMoreWhenThisCloseToTop = 700, // px
  skeletonComponent,
  loadMore,
  numberOfPages,
}: {
  children: ReactNode;
  isBottomSticky?: boolean;
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  loadMoreWhenThisCloseToTop?: number;
  loadMore?: () => void;
  numberOfPages?: number;
}) => {
  useRequiredContext(ScrollContext);

  const getScrollMeasurements = useScroll((c) => c.getScrollMeasurements);
  const scrollToBottom = useScroll((c) => c.scrollToBottom);
  const scrollToTop = useScroll((c) => c.scrollToTop);
  const containerRef = useScroll((c) => c.containerRef);
  const contentRef = useScroll((c) => c.contentRef);
  const vagueScrollPositionRef = useScroll((c) => c.vagueScrollPositionRef);
  const setContentFitsInContainer = useScroll(
    (c) => c.setContentFitsInContainer,
  );

  // optional, to put skeletons on top or below content (or both)
  const topSkeletonContainerRef = useRef<HTMLDivElement>(null);
  const bottomSkeletonContainerRef = useRef<HTMLDivElement>(null);

  const loadingStatusRef = useRef(loadingStatus);
  loadingStatusRef.current = loadingStatus;

  const numberOfPagesRef = useRef(numberOfPages);
  numberOfPagesRef.current = numberOfPages;

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

  const contextValue = {
    topSkeletonContainerRef,
    bottomSkeletonContainerRef,
    scrollToBottom,
    scrollToTop,
    loadingStatus,
    skeletonComponent,
  };

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
};

export const Items = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  useRequiredContext(ScrollContext);

  const contentRef = useScroll((c) => c.contentRef);

  return (
    <div className={cn(className)} ref={contentRef}>
      {children}
    </div>
  );
};

export const Skeletons = ({
  count = 30,
  position = null,
  className,
}: {
  count?: number;
  position?: "aboveContent" | "belowContent" | null;
  className?: string;
}) => {
  useRequiredContext(ListContext);

  const skeletonComponent = useList((c) => c.skeletonComponent);
  const loadingStatus = useList((c) => c.loadingStatus);
  const topSkeletonContainerRef = useList((c) => c.topSkeletonContainerRef);
  const bottomSkeletonContainerRef = useList(
    (c) => c.bottomSkeletonContainerRef,
  );

  const showSkeleton =
    loadingStatus && skeletonComponent && loadingStatus !== "Exhausted";

  if (!showSkeleton) return null;

  const ref =
    position === "aboveContent"
      ? topSkeletonContainerRef
      : position === "belowContent"
        ? bottomSkeletonContainerRef
        : null;

  return (
    <div className={cn(className)} ref={ref}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {isValidElement(skeletonComponent)
            ? cloneElement(skeletonComponent as any, { index } as any)
            : skeletonComponent}
        </div>
      ))}
    </div>
  );
};
