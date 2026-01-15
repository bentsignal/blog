import {
  base16AteliersulphurpoolLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import * as Theme from "@/atoms/theme";

const useCodeTheme = () => {
  const theme = Theme.useStore((s) => s.theme);
  return theme === "dark" ? nord : base16AteliersulphurpoolLight;
};

export { useCodeTheme };
