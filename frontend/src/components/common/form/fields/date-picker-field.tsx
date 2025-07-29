import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Datepicker from "../../datePicker";
import clsx from "clsx";

type DatePickerFieldProps = {
  fieldName: string;
  languageName: string;
  required: boolean;
  fieldHeight: string;
  requiredLabel?: boolean;
  fieldWidth: string;
  disabled?: boolean;
  placeholder?:string;
  labelName?:string;
  fieldStyle?:string;
  labelStyle?:string;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  fieldName,
  required,
  fieldHeight,
  requiredLabel = true,
  disabled = false,
  placeholder = 'Date of Birth',
  labelName= 'Birthday',
  fieldStyle = '',
  labelStyle= ''
}) => {
  const form = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={clsx("flex flex-col ",fieldStyle)}>
          {requiredLabel && (
            <FormLabel className={clsx('font-semibold text-[16px] text-[#05060F] ',labelStyle)}>
              {
                labelName ? labelName : 'Birthday'
              }
              {required && <span className="ms-1 text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl className="border-2">
            <Datepicker
              height={`${fieldHeight}`}
              same={disabled}
              field={field}
              open={open}
              setOpen={setOpen}
              placeholder={placeholder}
              onSelect={(value) => {
                form.setValue(fieldName, value!);
                setOpen(false);
              }}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
