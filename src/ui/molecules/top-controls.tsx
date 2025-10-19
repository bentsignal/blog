import * as Sidebar from "@/ui/atoms/sidebar";
import { ThemeToggle } from "@/ui/molecules/theme-toggle";

export const TopControls = () => {
  return (
    <div className="mouse-events-none absolute top-0 left-0 z-100 flex w-full justify-between p-3">
      <Sidebar.Trigger />
      <ThemeToggle />
    </div>
  );
};
