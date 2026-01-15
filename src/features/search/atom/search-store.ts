"use client";

import { createStore } from "rostra";
import useDebouncedInput from "@/hooks/use-debounced-input";

function useInternalStore() {
  const {
    value: searchTerm,
    setValue: setSearchTerm,
    debouncedValue: debouncedSearchTerm,
  } = useDebouncedInput();

  return {
    searchTerm,
    setSearchTerm,
    debouncedSearchTerm,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
