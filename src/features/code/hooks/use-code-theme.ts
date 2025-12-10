import {
  base16AteliersulphurpoolLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import * as Theme from "@/atoms/theme";
import { useRequiredContext } from "@/lib/context";

const useCodeTheme = () => {
  useRequiredContext(Theme.Context);
  const theme = Theme.use((c) => c.theme);
  return theme === "dark" ? nord : base16AteliersulphurpoolLight;
};

export { useCodeTheme };
