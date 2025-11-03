import { cn } from "@/utils/style-utils";

const shared =
  "bg-background/10 absolute z-5 left-0 flex h-16 w-full backdrop-blur-sm pointer-events-none";

export const Top = ({ className }: { className?: string }) => {
  return <div className={cn(shared, "top-0 mask-b-from-35%", className)} />;
};

export const Bottom = ({ className }: { className?: string }) => {
  return <div className={cn(shared, "bottom-0 mask-t-from-35%", className)} />;
};
