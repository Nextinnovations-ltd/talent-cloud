/* eslint-disable @typescript-eslint/no-explicit-any */
// UserWorkExperienceForm.js
// import { fields } from "@/lib/formData.tsx/UserWorkExperience"; // Adjust path if needed
import InputField from "../common/form/fields/input-field"; // Adjust path if needed
import TextAreaField from "../common/form/fields/text-area-field"; // Adjust path if needed
import { useTranslation } from "react-i18next";
import { SelectField } from "../common/form/fields/select-field"; // Adjust path if needed
import CustomCheckbox from "../common/form/fields/checkBox-field"; // Adjust path if needed

const monthData = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const generateYearData = (
  startYear = 2000,
  endYear = new Date().getFullYear()
) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return { value: year.toString(), label: year.toString() };
  });
};

export const UserWorkExperienceForm = ({
  form,
  fields,
}: {
  form: any;
  jobId: any;
  fields: any;
}) => {
  const { t } = useTranslation("userProfile");
  const {
    register,
    formState: { errors },
  } = form;



  // const getFieldName = (fieldName: any) => `${fieldName}_${jobId}`;

  return (
    <div className="space-y-[30px]">
      {fields.map((field: any) => {
        if (field.isGroup) {
          return (
            <div key={field.name} className="space-y-2">
              <label className="font-light text-black">
                {t(`${field.name}`)}
              </label>
              <div className="flex max-w-[672px]  gap-4">
                {field.childField.map((fieldChild: any) => (
                  <SelectField
                    key={fieldChild.name}
                    name={fieldChild.name}
                    {...register(fieldChild.name)}
                    error={errors[fieldChild.name]?.message}
                    translationKey={fieldChild.translationKey}
                    isRequired={false}
                    data={
                      fieldChild?.placeholder === "Year"
                        ? generateYearData()
                        : monthData
                    }
                    showRequiredLabel={false}
                    placeholder={fieldChild.placeholder}
                    width="w-[50%]"
                  />
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "text") {
          return (
            <InputField
              key={field.name}
              lableName={field.name}
              fieldName={field.name}
              {...register(field.name)}
              isError={errors[field.name]?.message}
              languageName={field.translationKey}
              required={false}
              placeholder={field.placeholder}
              showLetterCount={field.showLetterCount}
              maxLength={field.maxLength}
            />
          );
        }

        if (field.type === "textArea") {
          return (
            <TextAreaField
              key={field.name}
              lableName={field.name}
              fieldName={field.name}
              {...register(field.name)}
              isError={errors[field.name]?.message}
              required={false}
              requiredLabel={field.requiredLabel}
              languageName={field.translationKey}
              showLetterCount={field.showLetterCount}
              maxLength={field.maxLength}
              description={field.description}
              descriptionText={field.descriptionText}
              fieldHeight={field.height ?? "h-[128px]"}
            />
          );
        }

        if (field.type === "checkbox") {
          return (
            <CustomCheckbox
              form={form}
              fieldName={"currentlyWork"}
              {...register("currentlyWork")}
              text={t("I currently work here")}
              typeStyle="mono"
            />
          );
        }

        return null;
      })}
    </div>
  );
};
