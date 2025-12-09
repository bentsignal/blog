"use client";

import { ThemeContext, useTheme } from "@/atoms/theme";
import { useRequiredContext } from "@/lib/context";

const useThemeColor = () => {
  useRequiredContext(ThemeContext);
  const theme = useTheme((c) => c.theme);
  return theme === "light" ? "black" : "white";
};

export { useThemeColor };
