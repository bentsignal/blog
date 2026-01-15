import * as Search from "@/features/search/atom";
import * as InputGroup from "@/atoms/input-group";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  return (
    <InputGroup.Frame className="rounded-none border-none bg-transparent! shadow-none! ring-0!">
      <Search.Icon />
      <Search.Input placeholder={placeholder} />
      <Search.ClearButton />
    </InputGroup.Frame>
  );
};

export { SearchBar };
