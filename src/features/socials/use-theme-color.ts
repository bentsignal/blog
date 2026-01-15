"use client";

import * as Theme from "@/atoms/theme";

const useThemeColor = () => {
  const theme = Theme.useStore((s) => s.theme);
  return theme === "light" ? "black" : "white";
};

export { useThemeColor };
