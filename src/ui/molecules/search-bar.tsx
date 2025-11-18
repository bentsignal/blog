import { SearchContext, useSearch } from "@/context/search-context";
import { cn } from "@/utils/style-utils";
import { useHasParentContext } from "@fluentui/react-context-selector";
import { Search, X } from "lucide-react";
import * as InputGroup from "@/ui/atoms/input-group";

export const SearchBar = ({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) => {
  const hasSearchContext = useHasParentContext(SearchContext);
  if (!hasSearchContext) {
    throw new Error("SearchContext not found");
  }

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
