"use client";

import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { type Theme } from "./theme-types";
import { createContext } from "@/lib/context";
import { useIsClient } from "@/hooks/use-is-client";

const { Context, use } = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ displayName: "ThemeContext" });

// this is the outer theme provider, where next-themes wraps the custom theme
// provider we use throughout the app. the reason it has to wrap the custom
// provider is so that the custom one can use useTheme from next-themes.
function Provider({
  children,
  themeCookieValue,
  ...props
}: React.ComponentProps<typeof NextThemeProvider> & {
  themeCookieValue?: string;
}) {
  return (
    <NextThemeProvider {...props}>
      <CustomThemeProvider themeCookieValue={themeCookieValue}>
        {children}
      </CustomThemeProvider>
    </NextThemeProvider>
  );
}

function CustomThemeProvider({
  themeCookieValue,
  children,
}: {
  themeCookieValue?: string;
  children: React.ReactNode;
}) {
  const isClient = useIsClient();
  const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();

  const clientValue = resolvedTheme === "light" ? "light" : "dark";
  const serverValue = themeCookieValue === "light" ? "light" : "dark";
  const theme = isClient ? clientValue : serverValue;

  const setTheme = (theme: Theme) => {
    setNextTheme(theme);
    document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  const contextValue = { theme: theme as Theme, setTheme };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export { Provider, Context, use };
