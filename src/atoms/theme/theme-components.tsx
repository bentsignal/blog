"use client";

import { Moon, Sun } from "lucide-react";
import { useStore as useThemeStore } from "./theme-store";
import { Button } from "@/atoms/button";

export const ToggleButton = () => {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const oppositeTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      variant="link"
      onClick={() => setTheme(oppositeTheme)}
      className="focus-visible:ring-0"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      Switch to {oppositeTheme} mode
    </Button>
  );
};
