import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import clsx from "clsx";
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
  readOnly?:boolean;
  labelSize?:string
};

const  InputField: React.FC<DatePickerFieldProps> = ({
  fieldName,
  languageName,
  required,
  fieldHeight = "h-12",
  fieldWidth = " max-w-[672px]",
  placeholder = "Type Here...",
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
  readOnly = false,
  labelSize
}) => {
  const form = useFormContext();
  const { t } = useTranslation(languageName);

  // Handler to restrict input to numbers only
  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    // Allow only digits and optional decimal point
    input.value = input.value.replace(/[^\d.]/g, '');
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={clsx(fieldWidth,'translate-y-[-4px]')}>
          {requiredLabel && (
            <FormLabel className={clsx('font-[500] text-[14px] md:text-[16px] text-[#05060F] ',labelSize)}>
              {lableName && t(lableName)}
              {!lableName && t(fieldName)}
              {required && <span className="ms-1 text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            < >
              <Input
                type={type}
                disabled={disabled}
                isError={isError}
                className={cn(
                 
                  "text-[14px] disabled:border-none disabled:opacity-100  disabled:text-secondaryTextColor disabled:bg-[#F1F5FB] border-[#CBD5E1] placeholder-[#D9D9D9] ",
                  
                  fieldHeight

                )}
                readOnly={readOnly}
                startIcon={startIcon}
                showPasswordIcon={showPasswordIcon}
                hidePasswordIcon={hidePasswordIcon}
                placeholder={placeholder}
                showLetterCount={showLetterCount}
                maxLength={maxLength}
                // Only add onInput if type is number
                {...(type === 'number' ? { onInput: handleNumberInput } : {})}
                {...field}
              />
              
            </>
          </FormControl>
          <FormMessage className="absolute " />
          {description && (
          <h3 className="text-[#686C73] font-normal text-[14px]">
            {descriptionText}
          </h3>
        )}
        </FormItem>
      )}
    />
  );
};

export default InputField;
