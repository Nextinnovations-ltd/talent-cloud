import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import { cn } from "@/lib/utils";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { loginSchema } from "@/lib/inputYupSchema";
import { NavLink } from "@/components/common/NavLink";
import { fields } from "@/lib/formData.tsx/LoginFieldData";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { useSelector } from "react-redux";
import { selectKeepMeLoggedIn } from "@/services/slices/authSlice";
import routesMap from "@/constants/routesMap";

const fieldHeight = "h-12 ";
const filedWidth = "w-full";

export const LoginForm = ({
  onSubmitHandler,
  isLoading,
}: {
  onSubmitHandler: any;
  isLoading: boolean;
}) => {
  const keepMeLoggedIn = useSelector(selectKeepMeLoggedIn);
  const { t } = useTranslation("auth");

  const form = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      rememberMe: keepMeLoggedIn,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitHandler)}
        className="space-y-6 my-4 "
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
        <div className="flex  items-center justify-between">
          <CustomCheckbox
            form={form}
            fieldName="rememberMe"
            text={t("rememberMe")}
          />
          <NavLink
            title={t("forgotPassword")}
            to={`/auth/${routesMap.forgetPassword.path}`}
          />
        </div>
        <PrimaryButton
          loading={isLoading}
          title={t("title")}
          isButtonDisabled={isLoading}
        />
      </form>
    </Form>
  );
};
