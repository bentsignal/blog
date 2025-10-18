"use client";

import { ListContext, useList } from "@/context/list-context";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { ArrowDown } from "lucide-react";
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
        "mask-t-from-97% mask-b-from-97%",
        "align-start flex min-h-0 flex-1 flex-col justify-start",
        className,
      )}
      ref={scrollRef}
    >
      <Skeleton />
      {children}
    </div>
  );
};

export const ScrollToBottomButton = () => {
  const hasScrollContext = useHasParentContext(ListContext);
  if (!hasScrollContext) {
    throw new Error("ListContext not found");
  }

  const showScrollToBottomButton = useList((c) => c.showScrollToBottomButton);
  const scrollToBottom = useList((c) => c.scrollToBottom);

  if (!showScrollToBottomButton) return null;

  return (
    <div className="absolute right-0 bottom-0 flex justify-end p-4">
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
