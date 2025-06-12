import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import { cn } from "@/lib/utils";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { fields } from "@/lib/formData.tsx/SignupFieldData";
import { PrimaryButton } from "@/components/common/PrimaryButton";

const fieldHeight = "h-12 ";
const filedWidth = "w-full";

export const SignUpForm = ({
  onSubmitHandler,
  form,
  isLoading,
}: {
  onSubmitHandler: any;
  form: any;
  isLoading: boolean;
}) => {
  const { t } = useTranslation("auth");

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
        <div className="flex items-center justify-between">
          <CustomCheckbox
            form={form}
            fieldName="tap"
            text={
              <p className=" leading-6 mt-[-5px] text-text-semilight">
                By signing up, you are agreeing to our{" "}
                <Link
                  to={"/"}
                  className="text-sm text-text-lightblue hover:underline hover:text-text-hoverskyblue transition duration-100"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to={"/"}
                  className="text-sm text-text-lightblue hover:underline hover:text-text-hoverskyblue transition duration-100"
                >
                  {" "}
                  Privacy Policy.
                </Link>{" "}
              </p>
            }
          />
        </div>
        <PrimaryButton loading={isLoading} title={t("create")} isButtonDisabled={isLoading} />
      </form>
    </Form>
  );
};
