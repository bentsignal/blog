"use client";

import {
  ReactNode,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createContext } from "@/lib/context";

type VagueScrollPosition = "top" | "middle" | "bottom";

const { Context, useContext } = createContext<{
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

const Provider = ({
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

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
