import InputField from "@/components/common/form/fields/input-field";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
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
import routesMap from "@/constants/routesMap";
import { useApiCaller } from "@/hooks/useApicaller";
import { fields } from "@/lib/formData.tsx/PasswordFieldData";
import { ForgotPasswordSchema } from "@/lib/inputYupSchema";
import { cn } from "@/lib/utils";
import { useForgotPasswordMutation } from "@/services/slices/authSlice";
import useAuthStore from "@/state/zustand/auth-store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const fieldHeight = "h-12 ";
const filedWidth = "w-full";

export const ForgetPassword = () => {
  const { t } = useTranslation("forgotPassword");
  const [send, setSend] = useState(false);
  const { setEmail, email } = useAuthStore();

  const form = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const { executeApiCall, isLoading } = useApiCaller(useForgotPasswordMutation);

  const onSubmitHandler = async (value: any) => {
    try {
      const payload = {
        email: email || value.email,
      };

      setEmail(value.email);

      const result = await executeApiCall(payload);

      if (result.success) {
        setSend(true);
      } else {
        console.error("Error during API call:", result.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleSendAgain = async () => {
    try {
      const payload = {
        email: email,
      };

      const result = await executeApiCall(payload);

      if (result.success) {
        setSend(true);
      } else {
        console.error("Error during API call:", result.error);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div className="px-[10px] md:px-0 md:mx-0 h-[100svh] flex items-center justify-center bg-slate-100 ">
      <Card className="w-[506px]">
        <CardHeader className="text-center">
          <CardTitle className=" text-xl  ">
            <h3 className=" font-extrabold"> {t("title")}</h3>
          </CardTitle>
          <CardDescription className="max-w-[366px] mx-auto">
            {send ? (
              <div className=" text-[#686C73] leading-[21px]">
                <p className=" text-[16px]">
                  We’ve sent an email to{" "}
                  <span className=" font-semibold">{email}</span>
                </p>
                <p className="mt-[10px]">
                  Please check your inbox and follow the instructions to reset
                  your password.
                </p>
              </div>
            ) : (
              t("description")
            )}
          </CardDescription>
        </CardHeader>

        {!send && (
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitHandler)}
                className=" space-y-4 my-4"
              >
                <InputField
                  disabled={false}
                  fieldName={fields.fieldName}
                  placeholder={fields.placeholder}
                  isError={fields.isError(form)}
                  required={fields.required}
                  requiredLabel={fields.requiredLabel}
                  type={fields.type}
                  showPasswordIcon={fields.showPasswordIcon}
                  hidePasswordIcon={fields.hidePasswordIcon}
                  languageName={fields.languageName}
                  fieldHeight={cn("w-full", fieldHeight)}
                  fieldWidth={filedWidth}
                />
                <PrimaryButton
                  title="Send reset email"
                  isButtonDisabled={isLoading}
                />
              </form>
            </Form>
          </CardContent>
        )}

        <CardFooter className=" flex items-center justify-center p-5">
          {send ? (
            <p className=" flex items-center justify-center gap-2 text-[14px] text-[#686C73]">
              Didn’t receive an email?{" "}
              <div className="w-[100px]  h-[30px] flex items-center justify-center">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <span
                    className="text-[#37383F] underline cursor-pointer"
                    onClick={handleSendAgain}
                  >
                    Send again
                  </span>
                )}
              </div>
            </p>
          ) : (
            <NavLink to={`/auth/${routesMap.login.path}`} title="Back to Login" />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
