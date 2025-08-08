import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { useSearchParams } from "react-router-dom"

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

const sortOptions = [
  { value: "-created_at", label: "Latest" },
  { value: "created_at", label: "Oldest" },
]

export function PostUploadedCombo() {
  const [open, setOpen] = React.useState(false)

  // Get and set URL search params
  const [searchParams, setSearchParams] = useSearchParams()

  // Current ordering param from URL
  const currentOrdering = searchParams.get("ordering") || ""

  function onSelectOrdering(value: string) {
    if (value === currentOrdering) {
      // Toggle off: remove ordering param
      searchParams.delete("ordering")
      setSearchParams(searchParams)
    } else {
      // Set ordering param
      searchParams.set("ordering", value)
      setSearchParams(searchParams)
    }
    setOpen(false)
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
          {currentOrdering
            ? sortOptions.find((opt) => opt.value === currentOrdering)?.label
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
                  onSelect={onSelectOrdering}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      currentOrdering === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
