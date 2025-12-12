import {
  base16AteliersulphurpoolLight,
  nord,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRequiredContext } from "@/lib/context";
import * as Theme from "@/atoms/theme";

const useCodeTheme = () => {
  useRequiredContext(Theme.Context);
  const theme = Theme.useContext((c) => c.theme);
  return theme === "dark" ? nord : base16AteliersulphurpoolLight;
};

export { useCodeTheme };
