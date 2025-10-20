import { cn } from "@/utils/style-utils";

const shared =
  "bg-background/10 absolute z-5 flex h-16 w-full backdrop-blur-sm";

export const Top = ({ className }: { className?: string }) => {
  return (
    <div className={cn(shared, "top-0 left-0 mask-b-from-35%", className)} />
  );
};

export const Bottom = ({ className }: { className?: string }) => {
  return (
    <div className={cn(shared, "bottom-0 left-0 mask-t-from-35%", className)} />
  );
};
