"use client";

import { cloneElement, isValidElement } from "react";
import { useStore as useListStore } from "./list-store";
import { cn } from "@/utils/style-utils";
import * as Scroll from "@/atoms/scroll";

const Items = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const contentRef = Scroll.useStore((s) => s.contentRef);

  return (
    <div className={cn(className)} ref={contentRef}>
      {children}
    </div>
  );
};

const Skeletons = ({
  count = 30,
  position = null,
  className,
}: {
  count?: number;
  position?: "aboveContent" | "belowContent" | null;
  className?: string;
}) => {
  const skeletonComponent = useListStore((s) => s.skeletonComponent);
  const loadingStatus = useListStore((s) => s.loadingStatus);
  const topSkeletonContainerRef = useListStore(
    (s) => s.topSkeletonContainerRef,
  );
  const bottomSkeletonContainerRef = useListStore(
    (s) => s.bottomSkeletonContainerRef,
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

export { Items, Skeletons };
