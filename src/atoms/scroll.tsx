"use client";

import {
  ReactNode,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/style-utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./button";
import { createContext, useRequiredContext } from "@/lib/context";

export type VagueScrollPosition = "top" | "middle" | "bottom";

export const { Context: ScrollContext, use: useScroll } = createContext<{
  containerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  scrollToBottom: (behavior?: "instant" | "smooth") => void;
  scrollToTop: (behavior?: "instant" | "smooth") => void;
  vagueScrollPosition: VagueScrollPosition;
  vagueScrollPositionRef: RefObject<VagueScrollPosition>;
  contentFitsInContainer: boolean;
  setContentFitsInContainer: (contentFitsInContainer: boolean) => void;
  percentToBottom: number;
  getScrollMeasurements: () => {
    heightOfContainer: number;
    heightOfContent: number;
    heightOfScrollWindow: number;
    distanceFromTop: number;
    distanceFromBottom: number;
  };
  handleScroll: () => void;
}>({ displayName: "ScrollContext" });

export const Provider = ({
  children,
  startAt = "top",
  nearTopOrBottomThreshold = 10, // px
}: {
  children: ReactNode;
  startAt?: "bottom" | "top";
  nearTopOrBottomThreshold?: number;
}) => {
  // this is the scrollable container
  const containerRef = useRef<HTMLDivElement>(null);
  // this is the content inside the scrollable container
  const contentRef = useRef<HTMLDivElement>(null);

  const [percentToBottom, setPercentToBottom] = useState(
    startAt === "bottom" ? 100 : 0,
  );

  const [vagueScrollPosition, setVagueScrollPosition] =
    useState<VagueScrollPosition>(startAt === "bottom" ? "bottom" : "top");
  const vagueScrollPositionRef = useRef<VagueScrollPosition>(
    startAt === "bottom" ? "bottom" : "top",
  );

  const [contentFitsInContainer, setContentFitsInContainer] = useState(true);

  const getScrollMeasurements = useCallback(() => {
    const heightOfContainer = containerRef.current?.scrollHeight ?? 0;
    const heightOfScrollWindow = containerRef.current?.clientHeight ?? 0;
    const heightOfContent = contentRef.current?.clientHeight ?? 0;

    const distanceFromTop = containerRef.current?.scrollTop ?? 0;
    const distanceFromBottom =
      heightOfContainer - heightOfScrollWindow - distanceFromTop;

    return {
      heightOfContainer,
      heightOfContent,
      heightOfScrollWindow,
      distanceFromTop,
      distanceFromBottom,
    };
  }, []);

  const scrollToBottom = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      const { heightOfContainer, heightOfScrollWindow } =
        getScrollMeasurements();
      containerRef.current?.scrollTo({
        top: heightOfContainer - heightOfScrollWindow,
        behavior,
      });
    },
    [getScrollMeasurements],
  );

  const scrollToTop = useCallback(
    (behavior: "instant" | "smooth" = "instant") => {
      containerRef.current?.scrollTo({
        top: 0,
        behavior,
      });
    },
    [],
  );

  // handle scroll events (determine if user is at bottom, load more items when close to top of list)
  const handleScroll = useCallback(() => {
    if (containerRef.current === null) return;
    if (contentRef.current === null) return;

    const {
      heightOfScrollWindow,
      heightOfContent,
      distanceFromTop,
      distanceFromBottom,
    } = getScrollMeasurements();

    const newVagueScrollPosition =
      distanceFromTop <= nearTopOrBottomThreshold
        ? "top"
        : distanceFromBottom <= nearTopOrBottomThreshold
          ? "bottom"
          : "middle";
    vagueScrollPositionRef.current = newVagueScrollPosition;
    setVagueScrollPosition(newVagueScrollPosition);

    setContentFitsInContainer(heightOfContent <= heightOfScrollWindow);

    const newUnclampedPercentToBottom =
      (distanceFromTop / (heightOfContent - heightOfScrollWindow)) * 100;
    const newPercentToBottom =
      newUnclampedPercentToBottom > 100
        ? 100
        : newUnclampedPercentToBottom < 0
          ? 0
          : newUnclampedPercentToBottom;
    setPercentToBottom(newPercentToBottom);
  }, [nearTopOrBottomThreshold, getScrollMeasurements]);

  useLayoutEffect(() => {
    handleScroll();
  }, [handleScroll]);

  // optionally scroll to the bottom of the list before items are rendered
  useLayoutEffect(() => {
    if (startAt === "bottom") {
      scrollToBottom();
    }
  }, [startAt, scrollToBottom]);

  const contextValue = {
    containerRef,
    contentRef,
    scrollToBottom,
    scrollToTop,
    vagueScrollPosition,
    vagueScrollPositionRef,
    contentFitsInContainer,
    setContentFitsInContainer,
    percentToBottom,
    getScrollMeasurements,
    handleScroll,
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
};

export const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex max-h-screen flex-1 flex-col overflow-y-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Container = ({
  children,
  fade,
}: {
  children: React.ReactNode;
  fade?: "sm" | "md" | "lg";
}) => {
  useRequiredContext(ScrollContext);

  const containerRef = useScroll((c) => c.containerRef);
  const showScrollbar = useScroll((c) => c.vagueScrollPosition === "middle");
  const handleScroll = useScroll((c) => c.handleScroll);
  const scrollbarClass = showScrollbar
    ? "scrollbar-thumb-muted-foreground/10"
    : "scrollbar-thumb-transparent";

  const fadeClass =
    fade === "sm"
      ? "mask-t-from-99% mask-b-from-99%"
      : fade === "md"
        ? "mask-t-from-97% mask-b-from-97%"
        : fade === "lg"
          ? "mask-t-from-95% mask-b-from-95%"
          : undefined;

  return (
    <div
      className={cn(
        "overflow-y-auto overscroll-contain",
        "scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent",
        fadeClass,
        scrollbarClass,
      )}
      ref={containerRef}
      onScroll={handleScroll}
    >
      {children}
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
  useRequiredContext(ScrollContext);

  const contentRef = useScroll((c) => c.contentRef);

  return (
    <div className={cn(className)} ref={contentRef}>
      {children}
    </div>
  );
};

export const ScrollToBottomButton = ({
  className,
  hideWhenAtBottom = false,
}: {
  className?: string;
  hideWhenAtBottom?: boolean;
}) => {
  useRequiredContext(ScrollContext);

  const disableScrollToBottomButton = useScroll(
    (c) => c.vagueScrollPosition === "bottom",
  );
  const hideScrollToBottomButton = useScroll(
    (c) =>
      (hideWhenAtBottom && c.vagueScrollPosition === "bottom") ||
      c.contentFitsInContainer,
  );
  const scrollToBottom = useScroll((c) => c.scrollToBottom);

  if (hideScrollToBottomButton) return null;

  return (
    <div className={cn(className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollToBottom()}
        disabled={disableScrollToBottomButton}
      >
        <ArrowDown className="size-4" />
      </Button>
    </div>
  );
};

export const ScrollToTopButton = ({
  className,
  hideWhenAtTop = false,
}: {
  className?: string;
  hideWhenAtTop?: boolean;
}) => {
  useRequiredContext(ScrollContext);

  const disableScrollToTopButton = useScroll(
    (c) => c.vagueScrollPosition === "top",
  );
  const hideScrollToTopButton = useScroll(
    (c) =>
      (hideWhenAtTop && c.vagueScrollPosition === "top") ||
      c.contentFitsInContainer,
  );
  const scrollToTop = useScroll((c) => c.scrollToTop);

  if (hideScrollToTopButton) return null;

  return (
    <div className={cn(className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => scrollToTop()}
        disabled={disableScrollToTopButton}
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  );
};

export const ProgressBar = () => {
  useRequiredContext(ScrollContext);

  const percentToBottom = useScroll((c) => c.percentToBottom);

  return (
    <div className="absolute top-0 right-0 z-6 w-full">
      <div
        className="bg-primary h-1"
        style={{ width: `${percentToBottom}%` }}
      />
    </div>
  );
};
