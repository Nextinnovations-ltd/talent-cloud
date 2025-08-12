import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { useFormContext } from "react-hook-form";

type CheckboxFieldProps = {
    fieldName: string,
    fieldStyle: string,
    requiredLabel: boolean,
    labelStyle: string,
    labelName: string,
    required: boolean
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
    fieldName,
    fieldStyle,
    labelStyle,
    labelName,
}) => {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
                <FormItem className={clsx("flex flex-row items-center space-x-3 space-y-0", fieldStyle)}>
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    {labelName && (
                        <FormLabel className={clsx('font-normal', labelStyle)}>
                            {labelName}
                        </FormLabel>
                    )}
                </FormItem>
            )}
        />
    )
}

export default CheckboxField;