import * as React from "react"
import { Check, ChevronDown } from "lucide-react"


import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
interface PostUploadedComboProps {
  ordering: string; // current ordering value
  onOrderingChange: (newOrdering: string) => void; // callback when ordering changes
}

export function PostUploadedCombo({ ordering, onOrderingChange }: PostUploadedComboProps) {
  const [open, setOpen] = React.useState(false);

  const sortOptions = [
    { value: "-created_at", label: "Latest" },
    { value: "created_at", label: "Oldest" },
  ];

  function handleSelect(value: string) {
    if (value === ordering) {
      onOrderingChange(""); // toggle off
    } else {
      onOrderingChange(value);
    }
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[157px] px-[24px] rounded-[8px] py-[10px] justify-between"
        >
          {ordering
            ? sortOptions.find((opt) => opt.value === ordering)?.label
            : "Sort by Date"}
          <ChevronDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[157px] p-0">
        <Command>
          <CommandInput placeholder="Sort..." className="h-9" />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {sortOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      ordering === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
