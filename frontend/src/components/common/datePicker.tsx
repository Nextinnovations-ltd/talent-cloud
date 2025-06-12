import { FC, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CALENDAR } from "@/constants/svgs";

interface DatePickerProps {
  onSelect: (date: Date | undefined) => void;
  buttonClassNames?: string;
  same?: boolean;
  sameValue?: Date;
  placeholder?: string;
  form?: any;
  isRequired?: any;
  field?: any;
  disabled?: any;
  height?: string;
  open?: boolean;
  setOpen?: any;
}

const Datepicker: FC<DatePickerProps> = ({
  onSelect,
  placeholder,
  field,
  disabled,
  height,
  setOpen,
  open,
  buttonClassNames,
}) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    field.value ? new Date(field.value) : undefined
  );
  const handleSelect = (date: Date | undefined) => {
    setSelectedDay(date!);
    onSelect(date);
  };


  return (
    <Popover
      onOpenChange={() => setOpen((value: boolean) => !value)}
      open={open}
    >
      <PopoverTrigger className={"border-black bg-red-500"} asChild>
        <Button
          {...field}
          variant={"outline"}
          className={cn(
            "justify-between border-[#CBD5E1] border-[1px] bg-white text-left font-normal",
            !selectedDay && "text-muted-foreground",
            height,
            buttonClassNames
          )}
        >
          <div className="flex items-center justify-center gap-[25px] ">
            <CALENDAR />
            {field.value ? (
              format(field.value, "MMMM d, yyyy")
            ) : (
              <span className="text-[16px] text-[#CFD1D4]">
                {placeholder ? placeholder : "Date of Birth"}
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className=" p-0  w-auto border" align="start">
        <Calendar
          mode="single"
          defaultMonth={field.value}
          captionLayout="dropdown-buttons"
          selected={field.value}
          onSelect={handleSelect!}
          fromYear={1960}
          toYear={2030}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};

export default Datepicker;
