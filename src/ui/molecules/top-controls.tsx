"use client";

import { cn } from "@/utils/style-utils";
import * as Sidebar from "@/ui/atoms/sidebar";
import { ThemeToggle } from "@/ui/molecules/theme-toggle";

export const TopControls = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full justify-between p-2", className)}>
      <Sidebar.Trigger />
      <ThemeToggle />
    </div>
  );
};
