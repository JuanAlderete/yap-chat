import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/chatStore";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
}

function SearchInput({
  className,
  placeholder = "Buscar chats...",
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState("");
  const { setSearchQuery } = useChatStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, setSearchQuery]);

  const handleClear = () => {
    setLocalValue("");
    setSearchQuery("");
  };

  return (
    <div className="relative flex items-center w-full">
      <Search className="absolute left-2 md:left-3 h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={`pl-7 md:pl-9 pr-7 md:pr-9 h-8 md:h-9 text-xs md:text-sm ${className}`}
      />
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0.5 md:right-1 h-6 w-6 md:h-7 md:w-7 p-0 hover:bg-transparent"
          onClick={handleClear}
        >
          <X className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      )}
    </div>
  );
}

export default SearchInput;
