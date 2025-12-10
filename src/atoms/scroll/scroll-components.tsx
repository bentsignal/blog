"use client";

import { cn } from "@/utils/style-utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Context as ScrollContext, use as useScroll } from "./scroll-context";
import { Button } from "@/atoms/button";
import { useRequiredContext } from "@/lib/context";

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

const Content = ({
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

const ScrollToBottomButton = ({
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

const ScrollToTopButton = ({
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

const ProgressBar = () => {
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

export {
  Wrapper,
  Container,
  Content,
  ScrollToBottomButton,
  ScrollToTopButton,
  ProgressBar,
};
