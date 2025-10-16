import { getTextDateString, isToday, isYesterday } from "@/utils/time-utils";
import { Separator } from "@/ui/atoms/separator";

export const DateMarker = ({ time }: { time: number }) => {
  const label = isToday(time)
    ? "Today"
    : isYesterday(time)
      ? "Yesterday"
      : getTextDateString(time);
  return (
    <div className="mt-4 flex flex-row items-center">
      <Separator className="flex-1" />
      <div className="text-muted-foreground text-xxs px-4">{label}</div>
      <Separator className="flex-1" />
    </div>
  );
};
