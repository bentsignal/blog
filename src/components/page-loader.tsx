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

  useEffect(() => {
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

    if (target.current) {
      observer.current.observe(target.current);
    }

    return () => {
      if (observer.current && target.current) {
        observer.current.unobserve(target.current);
      }
      observer.current?.disconnect();
    };
  }, [loadMore]);

  return (
    <div ref={target} className={cn("flex h-0 w-full flex-1", className)}>
      {children}
    </div>
  );
}
