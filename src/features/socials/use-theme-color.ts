"use client";

import { useRequiredContext } from "@/lib/context";
import * as Theme from "@/atoms/theme";

const useThemeColor = () => {
  useRequiredContext(Theme.Context);
  const theme = Theme.useContext((c) => c.theme);
  return theme === "light" ? "black" : "white";
};

export { useThemeColor };
