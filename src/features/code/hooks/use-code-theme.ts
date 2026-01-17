import {
  base16AteliersulphurpoolLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import * as Theme from "@/features/theme/atom";

const useCodeTheme = () => {
  const inDarkMode = Theme.useStore((s) => s.theme.mode === "dark");
  return inDarkMode ? nord : base16AteliersulphurpoolLight;
};

export { useCodeTheme };
