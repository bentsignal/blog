"use client";

import * as Search from "@/features/search/atom";
import { cn } from "@/utils/style-utils";
import { Search as SearchIcon, X } from "lucide-react";
import * as InputGroup from "@/atoms/input-group";
import { useRequiredContext } from "@/lib/context";

const SearchBar = ({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) => {
  useRequiredContext(Search.Context);

  const searchTerm = Search.use((c) => c.searchTerm);
  const setSearchTerm = Search.use((c) => c.setSearchTerm);

  return (
    <InputGroup.Frame
      className={cn(
        className,
        "rounded-none border-none bg-transparent! shadow-none! ring-0!",
      )}
    >
      <InputGroup.Addon align="inline-start" className="pl-1.5">
        <SearchIcon className="size-4" />
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

export { SearchBar };
