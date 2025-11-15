"use client";

import { cn } from "@/utils/style-utils";
import MainMenu from "./main-menu";
import * as Sidebar from "@/ui/atoms/sidebar";

export const TopControls = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full justify-between p-2", className)}>
      <Sidebar.Trigger />
      <MainMenu />
    </div>
  );
};
