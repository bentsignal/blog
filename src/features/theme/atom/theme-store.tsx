"use client";

import { useState } from "react";
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { createStore } from "rostra";
import type { Theme } from "../themes";

type StoreProps = {
  initialTheme: Theme;
};

type StoreType = {
  theme: Theme;
  changeTheme: (newTheme: Theme) => void;
};

function useInternalStore({ initialTheme }: StoreProps) {
  const { setTheme: setNextTheme } = useNextTheme();
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const changeTheme = (newTheme: Theme) => {
    const previousTheme = theme;
    document.body.classList.remove(previousTheme.className);
    document.body.classList.add(newTheme.className);
    document.cookie = `theme=${newTheme.name}; path=/; max-age=${60 * 60 * 24 * 30}`;
    setNextTheme(newTheme.mode);
    setTheme(newTheme);
  };

  return { theme, changeTheme };
}

const { Store: InternalStore, useStore } = createStore<StoreProps, StoreType>(
  useInternalStore,
);

function Store({
  children,
  initialTheme,
  ...props
}: React.ComponentProps<typeof NextThemeProvider> & StoreProps) {
  return (
    <NextThemeProvider {...props}>
      <InternalStore initialTheme={initialTheme}>{children}</InternalStore>
    </NextThemeProvider>
  );
}

export { Store, useStore };
