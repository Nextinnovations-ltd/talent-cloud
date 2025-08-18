import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import clsx from "clsx";

const CustomCheckbox = ({
  form,
  fieldName,
  text,
  typeStyle,
}: {
  form: any;
  fieldName: string;
  text: string | React.ReactNode;
  typeStyle?: "mono" | "default";
}) => {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={clsx("flex justify-start items-center gap-2")}>
              <Checkbox
                 {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
                typeStyle={typeStyle}
                id="terms"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {text}
              </label>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomCheckbox;
