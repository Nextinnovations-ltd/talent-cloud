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
import clsx from "clsx";
import React from "react";
import { useFormContext } from "react-hook-form";
import { Portal } from "@radix-ui/react-portal";

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
  data?: { value: string | number; label: string }[]; // Explicitly defining data type
  labelName?: string;
  description?: string;
  labelStyle?: string;
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
  labelStyle
}) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {


        return (
          <FormItem className={cn(width, "")}>
            {showRequiredLabel && (
              <FormLabel className={clsx('font-semibold text-[16px] text-[#05060F] ', labelStyle)}>
                {labelName}
                {isRequired && <span className="ms-1 text-red-500">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                  disabled={isDisabled}
                >
                  <SelectTrigger
                    {...field}
                    className={cn(

                      field.value === "" || field.value === undefined ?
                        "text-slate-300" : "text-black",
                      error &&
                      "outline-bg-error  focus:ring-2 ring-bg-error focus:ring-bg-error focus-visible:border-bg-error",
                      'border-[#CBD5E1]',
                      height,
                    )}
                  >
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <Portal>
                    <SelectContent className="h-[200px] w-[95%] p-2">
                      {data.map((item) => (
                        <SelectItem value={item.value?.toString()}>{item.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Portal>

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
