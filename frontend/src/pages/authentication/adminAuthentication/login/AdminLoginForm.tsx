import { loginSchema } from "@/lib/AdminLoginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { fields } from "@/lib/formData.tsx/LoginFieldData";
import InputField from "@/components/common/form/fields/input-field";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/common/PrimaryButton";

const fieldHeight = "h-12 ";
const filedWidth = "w-full";

const AdminLoginForm = () => {

    const form = useForm({
        resolver: yupResolver(loginSchema),
    });


    const onSubmitHandler = () => {

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className="space-y-6 my-4 mx-auto  w-[500px]"
            >
                {fields.map((field) => (
                    <InputField
                        key={field.fieldName}
                        disabled={false}
                        fieldName={field.fieldName}
                        placeholder={field.placeholder}
                        isError={field.isError(form)}
                        required={field.required}
                        requiredLabel={field.requiredLabel}
                        type={field.type}
                        showPasswordIcon={field.showPasswordIcon}
                        hidePasswordIcon={field.hidePasswordIcon}
                        languageName={field.languageName}
                        fieldHeight={cn("w-full", fieldHeight)}
                        fieldWidth={filedWidth}
                    />
                ))}
                <PrimaryButton title="Login" loading={false} isButtonDisabled={false}/>
            </form>
        </Form>
    )
}

export default AdminLoginForm;;
