"use client";

import { Theme, themes } from "../themes";
import { useStore as useThemeStore } from "./theme-store";
import { cn } from "@/utils/style-utils";
import { Button } from "@/atoms/button";

export const Switcher = () => {
  return (
    <div className="flex flex-col items-start px-2 py-2">
      <span className="text-muted-foreground mb-1 text-xs">Theme</span>
      {Object.values(themes).map((theme) => {
        return <ThemeButton key={theme.name} theme={theme} />;
      })}
    </div>
  );
};

const ThemeButton = ({ theme }: { theme: Theme }) => {
  const changeTheme = useThemeStore((s) => s.changeTheme);
  const isActive = useThemeStore((s) => s.theme.name === theme.name);
  return (
    <Button
      onClick={() => {
        changeTheme(theme);
      }}
      variant="link"
      className="pl-0"
    >
      <div
        className={cn(
          "border-border size-6 cursor-pointer rounded-full select-none",
          isActive && "border-primary border-1",
          theme.className,
        )}
      />
      <span>{theme.name}</span>
    </Button>
  );
};
