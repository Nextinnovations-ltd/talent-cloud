/* eslint-disable @typescript-eslint/no-explicit-any */
import InputField from "@/components/common/form/fields/input-field";
import { NavLink } from "@/components/common/NavLink";
import PortalCopyRight from "@/components/common/PortalCopyRight";
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
import { fields } from "@/lib/formData.tsx/Createusername";
import { UsernameSchema } from "@/lib/inputYupSchema";
import { cn } from "@/lib/utils";
import { useGetUserInfoQuery } from "@/services/api/userSlice";
import { useUpdateUserNameMutation } from "@/services/slices/authSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const fieldHeight = "h-12 ";
const filedWidth = "w-full";

export const CreateUsername = () => {
  const { t } = useTranslation("createUsername");
  const { executeApiCall, isLoading } = useApiCaller(useUpdateUserNameMutation);
  const {refetch} = useGetUserInfoQuery();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(UsernameSchema),
  });

  const onSubmitHandler = async (data: any) => {
    try {
      const payload = {
        username: data.username,
      };

      const res = await executeApiCall(payload);
     


      if (res?.success) {
        refetch()

        navigate("/verify/userwelcome");


      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="px-[10px] md:px-0  md:mx-0 h-[100svh] flex items-center justify-center bg-slate-100 ">
      <Card className="w-[506px]">
        <CardHeader className="text-center">
          <CardTitle className=" text-xl ">
            <h3 className=" font-extrabold"> {t("title")}</h3>
          </CardTitle>
          <CardDescription className="max-w-[366px] mx-auto mt-[14px]">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4 my-4"
              onSubmit={form.handleSubmit(onSubmitHandler)}
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
                showLetterCount
                maxLength={50}
              />
              <PrimaryButton loading={isLoading} title="Submit" isButtonDisabled={isLoading} />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flexBox.center flex items-center justify-center">
          <NavLink to={`/auth/${routesMap.login.path}`} title="Back to Login" />
        </CardFooter>
      </Card>
      <PortalCopyRight boarding/>
    </div>
  );
};
