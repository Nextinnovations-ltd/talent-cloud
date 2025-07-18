import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
  type?: string;
  isError?: boolean;
  showPasswordIcon?: ReactNode;
  hidePasswordIcon?: ReactNode;
  showLetterCount?: boolean; // New prop to show/hide letter count
  maxLength?: number;
  description?: boolean;
  descriptionText?: string;
  startIcon?: ReactNode;
  lableName?: string;
};

const  InputField: React.FC<DatePickerFieldProps> = ({
  fieldName,
  languageName,
  required,
  fieldHeight = "h-12",
  fieldWidth = " max-w-[672px]",
  placeholder = "plac Holder",
  requiredLabel = true,
  disabled = false,
  type = "text",
  isError,
  showPasswordIcon,
  hidePasswordIcon,
  showLetterCount, // New prop to show/hide letter count
  maxLength,
  description,
  descriptionText,
  startIcon,
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
            <FormLabel className=" font-semibold text-[16px] text-[#05060F]">
              {lableName && t(lableName)}
              {!lableName && t(fieldName)}
              {required && <span className="ms-1 text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <>
              <Input
                type={type}
                disabled={disabled}
                isError={isError}
                className={cn(
                  fieldHeight,
                  "text-[14px]  disabled:border-none disabled:opacity-100  disabled:text-secondaryTextColor disabled:bg-[#F1F5FB] border-[#CBD5E1] "
                )}
                startIcon={startIcon}
                showPasswordIcon={showPasswordIcon}
                hidePasswordIcon={hidePasswordIcon}
                placeholder={placeholder}
                showLetterCount={showLetterCount}
                maxLength={maxLength}
                description={description}
                descriptionText={descriptionText}
                {...field}
              />
              
            </>
          </FormControl>
          <FormMessage />
          {description && (
          <h3 className="text-[#686C73] font-normal mt-[10px] text-[14px]">
            {descriptionText}
          </h3>
        )}
        </FormItem>
      )}
    />
  );
};

export default InputField;
