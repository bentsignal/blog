"use client";

import * as Theme from "@/atoms/theme";
import { useRequiredContext } from "@/lib/context";

const useThemeColor = () => {
  useRequiredContext(Theme.Context);
  const theme = Theme.useContext((c) => c.theme);
  return theme === "light" ? "black" : "white";
};

export { useThemeColor };
