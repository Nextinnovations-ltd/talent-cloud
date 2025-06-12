import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SelectFieldTreeProps {
  name: string;
  translationKey?: string; // Optional for localization
  isRequired?: boolean;
  height?: string;
  width?: string;
  placeholder?: string;
  showRequiredLabel?: boolean;
  isDisabled?: boolean;
  error?: boolean;
  data?: { value: string; label: string }[]; // Explicit data type
  labelName?: string;
}


export const SelectFieldTree: React.FC<SelectFieldTreeProps> = ({
  name,
  isRequired,
  height = "h-12",
  width = "w-full",
  placeholder,
  showRequiredLabel,
  isDisabled,
  error,
  data = [],
  labelName,
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(width)}>
          {showRequiredLabel && (
            <FormLabel className="font-light text-[16px] text-[#05060F]">
              {labelName}
              {isRequired && <span className="ms-1 text-danger-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isDisabled}
            >
              <SelectTrigger
                {...field}
                className={cn(
                  height,
                  "text-slate-300",
                  error &&
                    "outline-bg-error focus:ring-2 ring-bg-error focus:ring-bg-error focus-visible:border-bg-error"
                )}
              >
                {field.value ? (
                  <span className="text-black">
                    {data.find((item) => item.value === field.value)?.label ||
                      placeholder}
                  </span>
                ) : (
                  <span className="text-slate-300">{placeholder}</span>
                )}
              </SelectTrigger>
              <SelectContent className="h-[300px] p-2">
                <Accordion type="single" collapsible>
                  <AccordionItem className="border-none" value="item-1">
                    <AccordionTrigger className="group px-[10px] data-[state=open]:bg-[#F3F4F6] h-[46px] rounded-[10px]">
                      <span className="absolute left-2 flex h-3.5 w-5 items-center justify-center">
                        <div className="w-4 h-4 absolute left-2 border border-[#2222224D] flex items-center justify-center rounded-lg">
                          <div className="bg-[#353535] group-data-[state=closed]:hidden w-2.5 h-2.5 rounded-lg"></div>
                        </div>
                      </span>
                      <h3 className="ml-[30px]">Design & Creative</h3>
                    </AccordionTrigger>

                    {data.map((item) => (
                      <AccordionContent
                        className="p-0 h-auto ml-[15px] mt-2"
                        key={item.value}
                      >
                        <SelectItem
                          className="rounded-[10px] h-[40px]"
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      </AccordionContent>
                    ))}
                  </AccordionItem>

                  <AccordionItem className="border-none" value="item-2">
                    <AccordionTrigger className="group px-[10px] data-[state=open]:bg-[#F3F4F6] h-[46px] rounded-[10px]">
                      <span className="absolute left-2 flex h-3.5 w-5 items-center justify-center">
                        <div className="w-4 h-4 absolute left-2 border border-[#2222224D] flex items-center justify-center rounded-lg">
                          <div className="bg-[#353535] group-data-[state=closed]:hidden w-2.5 h-2.5 rounded-lg"></div>
                        </div>
                      </span>
                      <h3 className="ml-[30px]">IT & Development</h3>
                    </AccordionTrigger>
                    {[
                      { value: "03", label: "Frontend" },
                      { value: "04", label: "Backend" },
                    ].map((item) => (
                      <AccordionContent
                        className="p-0 h-auto ml-[15px] mt-2"
                        key={item.value}
                      >
                        <SelectItem
                          className="rounded-[10px] h-[40px]"
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                  <AccordionItem className="border-none" value="item-3">
                    <AccordionTrigger className="group px-[10px] data-[state=open]:bg-[#F3F4F6] h-[46px] rounded-[10px]">
                      <span className="absolute left-2 flex h-3.5 w-5 items-center justify-center">
                        <div className="w-4 h-4 absolute left-2 border border-[#2222224D] flex items-center justify-center rounded-lg">
                          <div className="bg-[#353535] group-data-[state=closed]:hidden w-2.5 h-2.5 rounded-lg"></div>
                        </div>
                      </span>
                      <h3 className="ml-[30px]">IT & Development</h3>
                    </AccordionTrigger>
                    {[
                      { value: "05", label: "Frontend 3" },
                      { value: "06", label: "Backend 1" },
                    ].map((item) => (
                      <AccordionContent
                        className="p-0 h-auto ml-[15px] mt-2"
                        key={item.value}
                      >
                        <SelectItem
                          className="rounded-[10px] h-[40px]"
                          value={item.value}
                        >
                          {item.label}
                        </SelectItem>
                      </AccordionContent>
                    ))}
                  </AccordionItem>
                </Accordion>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
