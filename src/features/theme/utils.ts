import { defaultTheme, themeNames, themes } from "./themes";
import type { ThemeName } from "./themes";

const getTheme = (input: string | undefined) => {
  if (input === undefined) return defaultTheme;
  if (themeNames.includes(input as ThemeName))
    return themes[input as ThemeName];
  return defaultTheme;
};

export { getTheme };
