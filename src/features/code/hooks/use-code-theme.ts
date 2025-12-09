import {
  base16AteliersulphurpoolLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { ThemeContext, useTheme } from "@/atoms/theme";
import { useRequiredContext } from "@/lib/context";

const useCodeTheme = () => {
  useRequiredContext(ThemeContext);
  const theme = useTheme((c) => c.theme);
  return theme === "dark" ? nord : base16AteliersulphurpoolLight;
};

export { useCodeTheme };
