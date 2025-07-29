import { loginSchema } from "@/lib/AdminLoginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { fields } from "@/lib/formData.tsx/LoginFieldData";
import InputField from "@/components/common/form/fields/input-field";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { useApiCaller } from "@/hooks/useApicaller";
import { useNavigate } from "react-router-dom";
import { useAdminLoginMutation } from "@/services/slices/adminAuthSlice";


const fieldHeight = "h-12 ";
const filedWidth = "w-full";

const AdminLoginForm = () => {

    const { executeApiCall, isLoading } = useApiCaller(useAdminLoginMutation);
    const navigate = useNavigate();

    const form = useForm({
        resolver: yupResolver(loginSchema),
    });


    const onSubmitHandler = async (data: { email: string; password: string; }) => {
        try {
            const payload = {
                email: data?.email,
                password: data?.password
            }

         const response = await executeApiCall(payload)


         if (response?.data?.data?.data?.token) {
        
          navigate('/admin/dashboard',{replace:true})
         }


     
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className="space-y-6 my-4 mx-auto  w-[500px]"
            >
                <h3 className="text-[26px] font-semibold">Login</h3>
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
                <PrimaryButton title="Login" loading={isLoading} isButtonDisabled={isLoading} />
            </form>
        </Form>
    )
}

export default AdminLoginForm;;
