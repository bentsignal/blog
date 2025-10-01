import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  loadMore: () => void;
  className?: string;
  children: React.ReactNode;
}

export default function PageLoader({
  status,
  loadMore,
  className,
  children,
}: PageLoaderProps) {
  const observer = useRef<IntersectionObserver | null>(null);
  const target = useRef<HTMLDivElement | null>(null);

  // when the target element comes into view, load more messages when available
  useEffect(() => {
    const targetElement = target.current;
    if (targetElement) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && status === "CanLoadMore") {
            loadMore();
          }
        },
        {
          threshold: 0.1,
        },
      );
      observer.current.observe(targetElement);
      return () => {
        observer.current?.unobserve(targetElement);
        observer.current?.disconnect();
      };
    }
  }, [loadMore, status]);

  return (
    <div ref={target} className={cn("flex h-0 w-full flex-1", className)}>
      {children}
    </div>
  );
}
