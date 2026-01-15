"use client";

import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { createStore } from "rostra";
import { useIsClient } from "@/hooks/use-is-client";

type Theme = "light" | "dark";

type StoreProps = {
  themeCookieValue?: string;
};

type StoreType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

function useInternalStore({ themeCookieValue }: StoreProps) {
  const isClient = useIsClient();
  const { resolvedTheme, setTheme: setNextTheme } = useNextTheme();

  const clientValue = resolvedTheme === "light" ? "light" : "dark";
  const serverValue = themeCookieValue === "light" ? "light" : "dark";
  const theme = isClient ? clientValue : serverValue;

  const setTheme = (theme: Theme) => {
    setNextTheme(theme);
    document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  return { theme: theme as Theme, setTheme };
}

const { Store: InternalStore, useStore } = createStore<StoreType, StoreProps>(
  useInternalStore,
);

function Store({
  children,
  themeCookieValue,
  ...props
}: React.ComponentProps<typeof NextThemeProvider> & StoreProps) {
  return (
    <NextThemeProvider {...props}>
      <InternalStore themeCookieValue={themeCookieValue}>
        {children}
      </InternalStore>
    </NextThemeProvider>
  );
}

export { Store, useStore };
