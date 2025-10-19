import { cn } from "@/utils/style-utils";

export const HorizontalBar = ({
  width,
  className,
}: {
  width: number;
  className?: string;
}) => {
  return (
    <div
      className={cn("bg-border dark:bg-muted h-3 rounded-md", className)}
      style={{ width: `${width}px` }}
    />
  );
};

export const Circle = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "bg-border dark:bg-muted flex flex-shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
};
