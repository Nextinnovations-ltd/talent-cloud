import InputField from "@/components/common/form/fields/input-field";
import { NavLink } from "@/components/common/NavLink";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { resetPasswordFields } from "@/lib/formData.tsx/PasswordFieldData";
import { ResetPasswordSchema } from "@/lib/inputYupSchema";
import { cn } from "@/lib/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApiCaller } from "@/hooks/useApicaller";
import { useResetPasswordMutation } from "@/services/slices/authSlice";
import useAuthStore from "@/state/zustand/auth-store";

const fieldHeight = "h-12 ";
const filedWidth = "w-full";

export const ResetPassword = () => {
  const { t } = useTranslation("resetPassword");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const {email} = useAuthStore();
  const { executeApiCall, isLoading } = useApiCaller(useResetPasswordMutation);
  

  const form = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const onSubmitHandler = async(value: any) => {

    if(!email || !token){
      navigate('/forgetpassword')
    }

    try {
      const payload = {
        email:email,
        password: value.password,
        token:token
      };

      const result = await executeApiCall(payload);
       
      if(result.success)navigate('/auth/login')
      if(result.error)navigate('/forgetpassword')
    


    } catch (error) {}
  };

  return (
    <div className="mx-mobile  md:mx-0 h-[100svh] flex items-center justify-center bg-slate-100 ">
      <Card className="w-[506px]">
        <CardHeader className="text-center">
          <CardTitle className=" text-xl ">
            <h3 className=" font-bold"> {t("title")}</h3>
          </CardTitle>
          <CardDescription className="mt-[14px]">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitHandler)}
              className=" space-y-4 my-4"
            >
              <InputField
                disabled={false}
                fieldName={resetPasswordFields.fieldName}
                placeholder={resetPasswordFields.placeholder}
                isError={resetPasswordFields.isError(form)}
                required={resetPasswordFields.required}
                requiredLabel={resetPasswordFields.requiredLabel}
                type={resetPasswordFields.type}
                showPasswordIcon={resetPasswordFields.showPasswordIcon}
                hidePasswordIcon={resetPasswordFields.hidePasswordIcon}
                languageName={resetPasswordFields.languageName}
                fieldHeight={cn("w-full", fieldHeight)}
                fieldWidth={filedWidth}
              />
              <PrimaryButton
                title="Save new password"
                isButtonDisabled={isLoading}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flexBox.center flex items-center justify-center">
          <NavLink to="/login" title="Back to Login" />
        </CardFooter>
      </Card>
    </div>
  );
};
