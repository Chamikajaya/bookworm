import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onEnter: () => void;
  placeholder?: string;
  className?: string;
}

export const FilterSearchBar = ({
  value,
  onChange,
  onEnter,
  placeholder = "Search books...",
  className,
}: FilterSearchBarProps) => {
  return (
    <div className={`relative ${className || ""}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        className="pl-9"
      />
    </div>
  );
};
