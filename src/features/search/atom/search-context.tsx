"use client";

import { createContext } from "@/lib/context";
import useDebouncedInput from "@/hooks/use-debounced-input";

const { Context, useContext } = createContext<{
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  debouncedSearchTerm: string;
}>({ displayName: "SearchContext" });

const Provider = ({ children }: { children: React.ReactNode }) => {
  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput();

  const contextValue = {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
