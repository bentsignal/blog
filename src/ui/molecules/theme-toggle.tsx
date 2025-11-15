"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/ui/atoms/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

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
}
