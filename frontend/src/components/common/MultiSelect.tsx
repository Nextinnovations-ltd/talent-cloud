import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  X,
  Fish,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
}

export const MultiSelect = React.forwardRef<
  HTMLTextAreaElement,
  MultiSelectProps
>(
  (
    {
      options: initialOptions,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");
    const [options, setOptions] = React.useState(initialOptions);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (e.g., new line)
        const newValue = searchValue.trim();
        if (newValue && !selectedValues.includes(newValue)) {
          // Add the new value to the selected values
          const newSelectedValues = [...selectedValues, newValue];
          setSelectedValues(newSelectedValues);
          onValueChange(newSelectedValues);

          // Add the new value to the options list if it doesn't already exist
          if (!options.some((option) => option.value === newValue)) {
            const newOption = { value: newValue, label: newValue, icon: Fish }; // Use a default icon or leave it undefined
            setOptions([...options, newOption]);
          }

          // Clear the search value
          setSearchValue("");
        }
      } else if (event.key === "Backspace" && !searchValue) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };


    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1 ">
          {selectedValues.slice(0, maxCount).map((value) => {
            const option = options.find((o) => o.value === value);
            return (
              <Badge
                key={value}
                className={cn(
                  multiSelectVariants({ variant }),
                  "h-[32px] bg-[#EBEBEB] rounded-lg"
                )}
                style={{ animationDuration: `${animation}s` }}
              >
                <span className="text-[16px] font-normal">
                  {option?.label || value}
                </span>
                <X
                  color="#05060F80"
                  className="ml-2 h-4 w-4 cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleOption(value);
                  }}
                />
              </Badge>
            );
          })}
          {selectedValues.length > maxCount && (
            <Badge
              className={cn(
                "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                multiSelectVariants({ variant })
              )}
              style={{ animationDuration: `${animation}s` }}
            >
              {`+ ${selectedValues.length - maxCount} more`}
              <XCircle
                className="ml-2 h-4 w-4 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  clearExtraOptions();
                }}
              />
            </Badge>
          )}
        </div>
        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          modal={modalPopover}
        >
          <PopoverTrigger asChild>
            <Textarea
              ref={ref}
              {...props}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className={cn(
                "flex w-full px-3 py-2 duration-500 rounded-md drop-shadow-none shadow-none border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit [&_svg]:pointer-events-auto",
                className,
              )}
              placeholder={placeholder}
            />
          </PopoverTrigger>
          <PopoverContent
            className=" min-w-[674px] p-0"
            align="start"
            onEscapeKeyDown={() => setIsPopoverOpen(false)}
          >
            <Command>
              <CommandList>
                <CommandEmpty>No results found. Add new Skill</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleOption(option.value)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <h3 className="text-[#686C73] text-[14px] mt-[8px]">
          * Add up to 8 skills, separated by commas or choose from the list.
        </h3>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";