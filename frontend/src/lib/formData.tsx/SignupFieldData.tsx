import { EyeClosedIcon, EyeIcon } from "lucide-react";

export const fields: FieldDataType[] = [
  {
    fieldName: "email",
    placeholder: "Email Address",
    isError: (form: any) => !!form.formState.errors.email,
    required: true,
    requiredLabel: false,
    languageName: "auth",
    type: "email",
    showPasswordIcon: null,
    hidePasswordIcon: null,
  },
  {
    fieldName: "password",
    placeholder: "Password",
    isError: (form: any) => !!form.formState.errors.password,
    required: true,
    requiredLabel: false,
    languageName: "auth",
    type: "password",
    showPasswordIcon: <EyeIcon className="w-[20px] h-[20px] text-[#575D78]" />,
    hidePasswordIcon: (
      <EyeClosedIcon className="w-[20px] h-[20px] text-[#575D78]" />
    ),
  },
];
