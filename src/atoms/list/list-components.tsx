"use client";

import { cloneElement, isValidElement } from "react";
import { cn } from "@/utils/style-utils";
import { Context as ListContext, use as useList } from "./list-context";
import * as Scroll from "@/atoms/scroll";
import { useRequiredContext } from "@/lib/context";

export const Items = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  useRequiredContext(Scroll.Context);

  const contentRef = Scroll.use((c) => c.contentRef);

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
