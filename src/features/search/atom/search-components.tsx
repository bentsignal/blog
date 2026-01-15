"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useStore as useSearchStore } from "./search-store";
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
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  return (
    <InputGroup.Input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
    />
  );
};

const ClearButton = () => {
  const showClearButton = useSearchStore((s) => s.searchTerm.length > 0);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  return (
    <InputGroup.Addon
      align="inline-end"
      className={cn(
        showClearButton ? "cursor-pointer select-none" : "opacity-0",
      )}
    >
      <button onClick={() => setSearchTerm("")} className="cursor-pointer p-1">
        <X className="size-4" />
      </button>
    </InputGroup.Addon>
  );
};

export { Icon, Input, ClearButton };
