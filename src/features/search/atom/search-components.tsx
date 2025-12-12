"use client";

import { Search as SearchIcon, X } from "lucide-react";
import {
  Context as SearchContext,
  useContext as useSearch,
} from "./search-context";
import { useRequiredContext } from "@/lib/context";
import { cn } from "@/utils/style-utils";
import * as InputGroup from "@/atoms/input-group";

const Icon = () => {
  return (
    <InputGroup.Addon align="inline-start" className="pl-1.5">
      <SearchIcon className="size-4" />
    </InputGroup.Addon>
  );
};

const Input = ({ placeholder }: { placeholder: string }) => {
  useRequiredContext(SearchContext);
  const searchTerm = useSearch((c) => c.searchTerm);
  const setSearchTerm = useSearch((c) => c.setSearchTerm);
  return (
    <InputGroup.Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
    />
  );
};

const ClearButton = () => {
  useRequiredContext(SearchContext);
  const searchTerm = useSearch((c) => c.searchTerm);
  const setSearchTerm = useSearch((c) => c.setSearchTerm);
  return (
    <InputGroup.Addon
      align="inline-end"
      className={cn(
        searchTerm.length > 0 ? "cursor-pointer select-none" : "opacity-0",
      )}
    >
      <button onClick={() => setSearchTerm("")} className="cursor-pointer p-1">
        <X className="size-4" />
      </button>
    </InputGroup.Addon>
  );
};

export { Icon, Input, ClearButton };
