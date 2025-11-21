"use client";

import {
  ContextSelector,
  createContext,
  useContextSelector,
} from "@fluentui/react-context-selector";
import useDebouncedInput from "@/hooks/use-debounced-input";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  debouncedSearchTerm: string;
}

export const SearchContext = createContext<SearchContextType>(
  {} as SearchContextType,
);

SearchContext.displayName = "SearchContext";

export const useSearch = <T,>(
  selector: ContextSelector<SearchContextType, T>,
) => useContextSelector(SearchContext, selector);

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
