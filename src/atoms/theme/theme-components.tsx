"use client";

import { Moon, Sun } from "lucide-react";
import {
  Context as ThemeContext,
  useContext as useTheme,
} from "./theme-context";
import { useRequiredContext } from "@/lib/context";
import { Button } from "@/atoms/button";

export const ToggleButton = () => {
  useRequiredContext(ThemeContext);

  const theme = useTheme((c) => c.theme);
  const setTheme = useTheme((c) => c.setTheme);

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
