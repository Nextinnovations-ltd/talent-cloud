import {
  FormField,
  FormLabel,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import Datepicker from "../../datePicker";

type DatePickerFieldProps = {
  fieldName: string;
  languageName: string;
  required: boolean;
  fieldHeight: string;
  requiredLabel?: boolean;
  fieldWidth: string;
  disabled?: boolean;
  placeholder: string;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  fieldName,
  required,
  fieldHeight,
  requiredLabel = true,
  disabled = false,
  placeholder,
}) => {
  const form = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={"flex flex-col "}>
          {requiredLabel && (
            <FormLabel className="font-semibold text-[16px]   poppins-semibold ">
              Birthday
              {required && <span className="ms-1 text-danger-500">*</span>}
            </FormLabel>
          )}
          <FormControl className="border-2">
            <Datepicker
              height={`${fieldHeight}`}
              buttonClassNames="w-[672px]"
              same={disabled}
              field={field}
              open={open}
              setOpen={setOpen}
              placeholder={"Date of Birth"}
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
