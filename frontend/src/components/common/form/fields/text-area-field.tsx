import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type DatePickerFieldProps = {
  fieldName: string;
  languageName: string;
  required: boolean;
  fieldHeight?: string;
  fieldWidth?: string;
  placeholder?: string;
  requiredLabel?: boolean;
  disabled?: boolean;
  isError?: boolean;
  showPasswordIcon?: ReactNode;
  hidePasswordIcon?: ReactNode;
  showLetterCount?: boolean; // New prop to show/hide letter count
  maxLength?: number;
  description?: boolean;
  descriptionText?: string;
  lableName?: string;
};

const TextAreaField: React.FC<DatePickerFieldProps> = ({
  fieldName,
  languageName,
  required,
  fieldHeight = "h-12",
  fieldWidth = " max-w-[672px]",
  placeholder = "Place holder",
  requiredLabel = true,
  disabled = false,
  isError,
  showLetterCount, // New prop to show/hide letter count
  maxLength,
  lableName,
}) => {
  const form = useFormContext();
  const { t } = useTranslation(languageName);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={fieldWidth}>
          {requiredLabel && (
            <FormLabel className="  font-semibold text-[16px] text-[#05060F]">
              {lableName && t(lableName)}
              {!lableName && t(fieldName)}
              {required && <span className="ms-1 text-danger-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <>
              <Textarea
                disabled={disabled}
                isError={isError}
                className={cn(
                  fieldHeight,
                  "text-[14px] disabled:border-none disabled:opacity-100  disabled:text-secondaryTextColor disabled:bg-[#F1F5FB] "
                )}
                placeholder={placeholder}
                showLetterCount={showLetterCount}
                maxLength={maxLength}
                {...field}
              />
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaField;
