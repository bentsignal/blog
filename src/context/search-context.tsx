"use client";

import { createContext } from "@/lib/context";
import useDebouncedInput from "@/hooks/use-debounced-input";

export const { Context: SearchContext, useContext: useSearch } = createContext<{
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  debouncedSearchTerm: string;
}>({ displayName: "SearchContext" });

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput();

  const contextValue = { searchTerm, setSearchTerm, debouncedSearchTerm };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
