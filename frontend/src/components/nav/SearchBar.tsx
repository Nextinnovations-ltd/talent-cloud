import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import clsx from "clsx";
import React, { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  width?: "lg" | "md";
  value: string;
  setValue: (v: string) => void;
  onSearch?: (e?: React.FormEvent) => void;
  isFocused?: boolean;
  setIsFocused?: (v: boolean) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const SUGGESTIONS = [
  "Frontend Developer",
  "Remote",
  "Internship",
  "DevOps",
  "Python",

];

export const SearchBar = ({
  width,
  value,
  setValue,
  onSearch,
  isFocused = false,
  setIsFocused,
  inputRef,
}: SearchBarProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Always show all suggestions regardless of input value
  const filteredSuggestions = SUGGESTIONS;

  // Show suggestions when focused
  useEffect(() => {
    setShowSuggestions(isFocused && filteredSuggestions.length > 0);
    setHighlighted(-1);
  }, [isFocused, value, filteredSuggestions.length]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && highlighted < filteredSuggestions.length) {
        setValue(filteredSuggestions[highlighted]);
      } else if (onSearch) {
        onSearch();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef?.current &&
        event.target !== inputRef.current
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputRef]);

  return (
    <div className="relative">
      <div
        className={clsx(
          `h-[54px] bg-[#F3F4F6] p-2 rounded-[25px] flex items-center justify-between transition-all duration-300`,
          width === "lg" && "w-[500px]",
          isFocused && "shadow-lg"
        )}
      >
        <Input
          ref={inputRef}
          width={"w-full"}
          placeholder="What are you looking for?"
          className={clsx(
            "border-none bg-[#F3F4F6] outline-none transition-all duration-300",
            isFocused ? "w-[350px]" : "w-[300px]"
          )}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused && setIsFocused(true)}
          onBlur={() => setIsFocused && setIsFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <Button
          className="bg-[#0389FF]  p-2 w-[38px] text-white h-[38px] rounded-full"
          type="submit"
          onClick={onSearch}
        >
          <SearchIcon />
        </Button>
      </div>
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute left-0 top-[60px] w-full bg-white rounded-xl shadow-lg z-50 border border-gray-100 animate-fade-in"
        >
          <div className="px-5 pt-3 pb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none">
            What users also search for
          </div>
          <div className="flex flex-wrap gap-2 px-5 pb-4 pt-1">
            
            {filteredSuggestions.map((s, idx) => (
              <div
                key={s}
                className={clsx(
                  "px-4 py-2 cursor-pointer rounded-full bg-blue-50 text-blue-500 text-sm font-medium border border-blue-100 hover:bg-blue-100 hover:text-blue-900 transition-all",
                  highlighted === idx && "ring-2 ring-blue-300"
                )}
                onMouseDown={() => {
                  setValue(s);
                  // Do not close dropdown or blur input after selecting a suggestion
                }}
                onMouseEnter={() => setHighlighted(idx)}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
