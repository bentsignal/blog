"use client";

import { cloneElement, isValidElement } from "react";
import { ListContext, useList } from "@/context/list-context";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./button";

export const Frame = ({
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
  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const containerRef = useList((c) => c.containerRef);
  const showScrollbar = useList(
    (c) => c.vagueScrollPosition === "middle" && c.hasScrollBeenMeasured,
  );

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
  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const contentRef = useList((c) => c.contentRef);

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
  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

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

export const ScrollToBottomButton = ({
  className,
  hideWhenAtBottom = false,
}: {
  className?: string;
  hideWhenAtBottom?: boolean;
}) => {
  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const disableScrollToBottomButton = useList(
    (c) => c.vagueScrollPosition === "bottom",
  );
  const hideScrollToBottomButton = useList(
    (c) =>
      (hideWhenAtBottom && c.vagueScrollPosition === "bottom") ||
      !c.hasScrollBeenMeasured ||
      c.contentFitsInContainer ||
      c.loadingStatus === "LoadingFirstPage",
  );
  const scrollToBottom = useList((c) => c.scrollToBottom);

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
  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const disableScrollToTopButton = useList(
    (c) => c.vagueScrollPosition === "top",
  );
  const hideScrollToTopButton = useList(
    (c) =>
      (hideWhenAtTop && c.vagueScrollPosition === "top") ||
      !c.hasScrollBeenMeasured ||
      c.contentFitsInContainer ||
      c.loadingStatus === "LoadingFirstPage",
  );
  const scrollToTop = useList((c) => c.scrollToTop);

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
  const hasListContext = useHasParentContext(ListContext);
  if (!hasListContext) {
    throw new Error("ListContext not found");
  }

  const percentToBottom = useList((c) => c.percentToBottom);

  return (
    <div className="absolute top-0 right-0 z-6 w-full">
      <div
        className="bg-primary h-1"
        style={{ width: `${percentToBottom}%` }}
      />
    </div>
  );
};
