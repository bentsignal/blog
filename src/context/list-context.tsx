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
} from "@fluentui/react-context-selector";
import { type PaginationStatus } from "convex/react";

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
