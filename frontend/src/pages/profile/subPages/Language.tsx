import { ProfileTitle } from "@/components/common/ProfileTitle";
import { LanguagesYupSchema } from "@/lib/LanguagesYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { SelectField } from "@/components/common/form/fields/select-field";
import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import { ADDPULSICON } from "@/constants/svgs";

type LanguagesForm = {
  language: string;
  proficiency: string;
};

type LanguagesFormValues = {
  languages: LanguagesForm[];
};

const proficiency = [
  {
    value: "beginner",
    label: "Beginner",
  },
  {
    value: "intermediate",
    label: "Intermediate",
  },
  {
    value: "fluent",
    label: "Fluent",
  },
  {
    value: "professional",
    label: "Professional",
  },
];

export const Language = () => {
  const form = useForm<LanguagesFormValues>({
    resolver: yupResolver(LanguagesYupSchema),
    defaultValues: {
      languages: [
        {
          language: "",
          proficiency: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    name: "languages",
    control: form.control,
  });

  const onSubmit = (data: LanguagesFormValues) => console.log(data);

  return (
    <div className=" mb-[120px]">
      <ProfileTitle title="Languages" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="mb-[14px] space-y-[14px]  max-w-[672px] "
            >

              <div className="flex items-start gap-[16px] justify-start">
                <InputField
                  fieldName={`languages.${index}.language`}
                  fieldWidth="w-[328px] "
                  languageName=""
                  isError={
                    !!form.formState.errors?.languages?.[index]?.language
                  }
                  lableName="Languages"
                  required={false}
                  placeholder="Type your language"
                  maxLength={60}
                  requiredLabel={false}
                  showLetterCount={false}
                />

                <SelectField
                  name={`languages.${index}.proficiency`}
                  labelName={""}
                  showRequiredLabel={false}
                  width="w-[328px] "
                  error={
                    !!form.formState.errors?.languages?.[index]?.proficiency
                  }
                  placeholder="Type your language"
                  data={proficiency}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({
                language: "",
                proficiency: "",
              })
            }
            className="mt-[60px] w-[161px] flex items-center gap-1 justify-center h-[45px] border-[#CBD5E1] border rounded-[26px] "
          >
            <ADDPULSICON />
            Add Language
          </button>
          <div className="max-w-[672px]  flex items-center justify-end">
            <button
              type="submit"
              className="mt-4 w-[155px] h-[48px] rounded-[26px] bg-blue-500  text-white px-4 py-2 "
            >
              Save Profile
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
