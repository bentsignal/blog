"use client";

import { cn } from "@/utils/style-utils";
import { Search, X } from "lucide-react";
import * as InputGroup from "@/atoms/input-group";
import { createContext, useRequiredContext } from "@/lib/context";
import useDebouncedInput from "@/hooks/use-debounced-input";

export const { Context: SearchContext, use: useSearch } = createContext<{
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

export const SearchBar = ({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) => {
  useRequiredContext(SearchContext);

  const searchTerm = useSearch((c) => c.searchTerm);
  const setSearchTerm = useSearch((c) => c.setSearchTerm);

  return (
    <InputGroup.Frame
      className={cn(
        className,
        "rounded-none border-none bg-transparent! shadow-none! ring-0!",
      )}
    >
      <InputGroup.Addon align="inline-start" className="pl-1.5">
        <Search className="size-4" />
      </InputGroup.Addon>
      <InputGroup.Input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
      />
      <InputGroup.Addon
        align="inline-end"
        className={cn(
          searchTerm.length > 0 ? "cursor-pointer select-none" : "opacity-0",
        )}
      >
        <button
          onClick={() => setSearchTerm("")}
          className="cursor-pointer p-1"
        >
          <X className="size-4" />
        </button>
      </InputGroup.Addon>
    </InputGroup.Frame>
  );
};
