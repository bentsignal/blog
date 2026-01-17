"use client";

import * as Theme from "@/features/theme/atom";

const useThemeColor = () => {
  const inLightMode = Theme.useStore((s) => s.theme.mode === "light");
  return inLightMode ? "black" : "white";
};

export { useThemeColor };
