export const fields: FieldDataType = {
  fieldName: "username",
  placeholder: "Username",
  isError: (form: any) => !!form.formState.errors.username,
  required: true,
  requiredLabel: false,
  languageName: "auth",
  type: "text",
  showPasswordIcon: null,
  hidePasswordIcon: null,
};
