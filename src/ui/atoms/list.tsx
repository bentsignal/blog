"use client";

import { ListContext, useList } from "@/context/list-context";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./button";
import * as ToolTip from "./tooltip";

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
        "relative flex flex-1 flex-col overflow-y-hidden",
        className,
      )}
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
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const scrollRef = useList((c) => c.scrollRef);

  return (
    <div
      className={cn(
        "overflow-y-auto overscroll-contain",
        "scrollbar-thin scrollbar-thumb-muted-foreground/10 scrollbar-track-transparent",
        "mask-t-from-99% mask-b-from-99%",
        className,
      )}
      ref={scrollRef}
    >
      <Skeleton />
      {children}
    </div>
  );
};

export const Skeleton = () => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const skeletonComponent = useList((c) => c.skeletonComponent);
  const loadingStatus = useList((c) => c.loadingStatus);

  const showSkeleton =
    loadingStatus && skeletonComponent && loadingStatus !== "Exhausted";

  if (!showSkeleton) return null;

  return (
    <div className="mt-3">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index}>{skeletonComponent}</div>
      ))}
    </div>
  );
};

export const ScrollToBottomButton = ({ className }: { className?: string }) => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const showScrollToBottomButton = useList(
    (c) => c.vagueScrollPosition !== "bottom",
  );
  const scrollToBottom = useList((c) => c.scrollToBottom);

  if (!showScrollToBottomButton) return null;

  return (
    <div className={cn(className)}>
      <ToolTip.Frame>
        <ToolTip.Trigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scrollToBottom()}
          >
            <ArrowDown className="size-4" />
          </Button>
        </ToolTip.Trigger>
        <ToolTip.Content>Scroll to bottom</ToolTip.Content>
      </ToolTip.Frame>
    </div>
  );
};

export const ScrollToTopButton = ({ className }: { className?: string }) => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const showScrollToTopButton = useList((c) => c.vagueScrollPosition !== "top");
  const scrollToTop = useList((c) => c.scrollToTop);

  if (!showScrollToTopButton) return null;

  return (
    <div className={cn(className)}>
      <ToolTip.Frame>
        <ToolTip.Trigger asChild>
          <Button variant="outline" size="icon" onClick={() => scrollToTop()}>
            <ArrowUp className="size-4" />
          </Button>
        </ToolTip.Trigger>
        <ToolTip.Content>Scroll to top</ToolTip.Content>
      </ToolTip.Frame>
    </div>
  );
};
