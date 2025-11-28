import { cn } from "@/utils/style-utils";

const shared = "bg-background/10 absolute z-5 flex pointer-events-none";

const verticalShared = "left-0 w-full h-16";
const horizontalShared = "top-0 h-full w-16";

type BlurSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

const getBlurSize = (blurSize: BlurSize) =>
  blurSize === "xs"
    ? "backdrop-blur-xs"
    : blurSize === "sm"
      ? "backdrop-blur-sm"
      : blurSize === "md"
        ? "backdrop-blur-md"
        : blurSize === "lg"
          ? "backdrop-blur-lg"
          : blurSize === "xl"
            ? "backdrop-blur-xl"
            : blurSize === "2xl"
              ? "backdrop-blur-2xl"
              : "backdrop-blur-3xl";

interface AbyssProps {
  className?: string;
  blurSize?: BlurSize;
}

export const Top = ({ className, blurSize = "sm" }: AbyssProps) => {
  return (
    <div
      className={cn(
        className,
        shared,
        verticalShared,
        "top-0 mask-b-from-35%",
        getBlurSize(blurSize),
      )}
    />
  );
};

export const Bottom = ({ className, blurSize = "sm" }: AbyssProps) => {
  return (
    <div
      className={cn(
        className,
        shared,
        verticalShared,
        "bottom-0 mask-t-from-35%",
        getBlurSize(blurSize),
      )}
    />
  );
};

export const Left = ({ className, blurSize = "sm" }: AbyssProps) => {
  return (
    <div
      className={cn(
        className,
        shared,
        horizontalShared,
        "left-0 mask-r-from-35%",
        getBlurSize(blurSize),
      )}
    />
  );
};

export const Right = ({ className, blurSize = "sm" }: AbyssProps) => {
  return (
    <div
      className={cn(
        className,
        shared,
        horizontalShared,
        "right-0",
        getBlurSize(blurSize),
      )}
    />
  );
};
