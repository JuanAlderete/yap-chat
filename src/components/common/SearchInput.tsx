// src/components/ui/SearchInput.tsx
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
  placeholder = "Search chats...",
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState("");
  const { setSearchQuery } = useChatStore();

  // Debounce para evitar búsquedas excesivas
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
    <div className="relative flex items-center">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={`pl-9 pr-9 ${className}`}
      />
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 h-7 w-7 p-0 hover:bg-transparent"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default SearchInput;
