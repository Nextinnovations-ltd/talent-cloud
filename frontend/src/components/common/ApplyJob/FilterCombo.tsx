"use client"

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

type JobTypeOption = {
  value: string;
  label: string;
};

interface FilterComboProps {
  title: string;
  data:JobTypeOption[]
}

export function FilterCombo({ title ,data}: FilterComboProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[257px] hover:bg-white w-auto px-[24px] border-none font-medium shadow-none h-[44px] rounded-[8px] gap-2 py-[10px] justify-between"
        >
          {value
            ? data.find((framework) => framework.value === value)?.label
            : title}
          <ChevronDown size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[257px] p-0">
        <Command>
          <CommandInput  placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {data.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
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
