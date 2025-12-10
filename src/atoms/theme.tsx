"use client";

import { Moon, Sun } from "lucide-react";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { Button } from "@/atoms/button";
import { createContext, useRequiredContext } from "@/lib/context";
import { useIsClient } from "@/hooks/use-is-client";

type Theme = "light" | "dark";

export const { Context: ThemeContext, use: useTheme } = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({ displayName: "ThemeContext" });

// this is the outer theme provider, where next-themes wraps the custom theme
// provider we use throughout the app. the reason it has to wrap the custom
// provider is so that the custom one can use useTheme from next-themes.
export function Provider({
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

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const ToggleButton = () => {
  useRequiredContext(ThemeContext);

  const theme = useTheme((c) => c.theme);
  const setTheme = useTheme((c) => c.setTheme);

  const oppositeTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      variant="link"
      onClick={() => setTheme(oppositeTheme)}
      className="focus-visible:ring-0"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
      Switch to {oppositeTheme} mode
    </Button>
  );
};
