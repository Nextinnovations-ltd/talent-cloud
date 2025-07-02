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
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";
import { useFormContext } from "react-hook-form";

interface SelectFieldProps {
  name: string;
  translationKey?: string; // Optional for localization
  isRequired?: boolean;
  height?: string;
  width?: string;
  placeholder?: string;
  showRequiredLabel?: boolean;
  isDisabled?: boolean;
  error?: boolean;
  data?: { value: string; label: string }[]; // Explicitly defining data type
  labelName?: string;
  description?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
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
  description,
}) => {
  const form = useFormContext();


  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {

        console.log("dkkd333kd---")
        console.log(field.value)
        console.log("dkkd333kd---")

        return (
          <FormItem className={cn(width, "")}>
            {showRequiredLabel && (
              <FormLabel className="font-semibold text-[16px] text-[#05060F]">
                {labelName}
                {isRequired && <span className="ms-1 text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div>
                <Select
                  onValueChange={field.onChange}
                  value={`${field.value}`}
                  disabled={isDisabled}
                >
                  <SelectTrigger
                    {...field}
                    className={cn(
                      height,
                      field.value === undefined?
                      "text-slate-300" : "text-black",
                      error &&
                      "outline-bg-error  focus:ring-2 ring-bg-error focus:ring-bg-error focus-visible:border-bg-error"
                    )}
                  >
                    <SelectValue  placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className="h-[200px] p-2">
                    {data.map((item) => (
                      <SelectItem value={item.value}>{item.label}</SelectItem>
                    ))}
                   
                  </SelectContent>
                 
                </Select>
                
                {description && (
                  <h3 className="text-[#686C73] text-[14px] mt-[8px]">
                    {description}
                  </h3>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
