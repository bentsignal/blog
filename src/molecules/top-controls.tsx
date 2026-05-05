"use client";

import MainMenu from "./main-menu";
import { cn } from "@/utils";

export const TopControls = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex w-full justify-end p-2", className)}>
      <MainMenu />
    </div>
  );
};
