"use client";

import {
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { type PaginationStatus } from "convex/react";
import * as Scroll from "@/atoms/scroll";
import { createContext, useRequiredContext } from "@/lib/context";

const { Context, use } = createContext<{
  loadingStatus?: PaginationStatus;
  skeletonComponent?: ReactNode;
  topSkeletonContainerRef: RefObject<HTMLDivElement | null>;
  bottomSkeletonContainerRef: RefObject<HTMLDivElement | null>;
}>({ displayName: "ListContext" });

const Provider = ({
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
  useRequiredContext(Scroll.Context);

  const getScrollMeasurements = Scroll.use((c) => c.getScrollMeasurements);
  const scrollToBottom = Scroll.use((c) => c.scrollToBottom);
  const scrollToTop = Scroll.use((c) => c.scrollToTop);
  const containerRef = Scroll.use((c) => c.containerRef);
  const contentRef = Scroll.use((c) => c.contentRef);
  const vagueScrollPositionRef = Scroll.use((c) => c.vagueScrollPositionRef);
  const setContentFitsInContainer = Scroll.use(
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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, use };
