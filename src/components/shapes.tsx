import { cn } from "@/lib/utils";

export const HorizontalBar = ({ width }: { width: number }) => {
  return (
    <div className="bg-muted h-3 rounded-md" style={{ width: `${width}%` }} />
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
        "bg-muted flex flex-shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      {children}
    </div>
  );
};
