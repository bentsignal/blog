"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useStore as useScrollStore } from "./scroll-store";
import { cn } from "@/utils/style-utils";
import { Button } from "@/atoms/button";

const Wrapper = ({
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
const Container = ({
  children,
  fade,
}: {
  children: React.ReactNode;
  fade?: "sm" | "md" | "lg";
}) => {
  const containerRef = useScrollStore((s) => s.containerRef);
  const showScrollbar = useScrollStore(
    (s) => s.vagueScrollPosition === "middle",
  );
  const handleScroll = useScrollStore((s) => s.handleScroll);
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

const Content = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const contentRef = useScrollStore((s) => s.contentRef);

  return (
    <div className={cn(className)} ref={contentRef}>
      {children}
    </div>
  );
};

const ScrollToBottomButton = ({
  className,
  hideWhenAtBottom = false,
}: {
  className?: string;
  hideWhenAtBottom?: boolean;
}) => {
  const disableScrollToBottomButton = useScrollStore(
    (s) => s.vagueScrollPosition === "bottom",
  );
  const hideScrollToBottomButton = useScrollStore(
    (s) =>
      (hideWhenAtBottom && s.vagueScrollPosition === "bottom") ||
      s.contentFitsInContainer,
  );
  const scrollToBottom = useScrollStore((s) => s.scrollToBottom);

  if (hideScrollToBottomButton) return null;

  return (
    <div className={cn(className)}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Scroll to bottom button"
        onClick={() => scrollToBottom()}
        disabled={disableScrollToBottomButton}
      >
        <ArrowDown className="size-4" />
      </Button>
    </div>
  );
};

const ScrollToTopButton = ({
  className,
  hideWhenAtTop = false,
}: {
  className?: string;
  hideWhenAtTop?: boolean;
}) => {
  const disableScrollToTopButton = useScrollStore(
    (s) => s.vagueScrollPosition === "top",
  );
  const hideScrollToTopButton = useScrollStore(
    (s) =>
      (hideWhenAtTop && s.vagueScrollPosition === "top") ||
      s.contentFitsInContainer,
  );
  const scrollToTop = useScrollStore((s) => s.scrollToTop);

  if (hideScrollToTopButton) return null;

  return (
    <div className={cn(className)}>
      <Button
        variant="outline"
        size="icon"
        aria-label="Scroll to top button"
        onClick={() => scrollToTop()}
        disabled={disableScrollToTopButton}
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  );
};

const ProgressBar = () => {
  const percentToBottom = useScrollStore((s) => s.percentToBottom);

  return (
    <div className="absolute top-0 right-0 z-6 w-full">
      <div
        className="bg-primary h-1"
        style={{ width: `${percentToBottom}%` }}
      />
    </div>
  );
};

export {
  Wrapper,
  Container,
  Content,
  ScrollToBottomButton,
  ScrollToTopButton,
  ProgressBar,
};
