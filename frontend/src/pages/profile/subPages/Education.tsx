import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Form } from "@/components/ui/form";
import { EducationYupSchema } from "@/lib/EducationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputField from "@/components/common/form/fields/input-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import TextAreaField from "@/components/common/form/fields/text-area-field";

type EducationFrom = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
};

const generateYearData = (
  startYear = 2000,
  endYear = new Date().getFullYear()
) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = (startYear + index).toString();
    return { value: year, label: year };
  });
};

export const Education = () => {
  const form = useForm<EducationFrom>({
    resolver: yupResolver(EducationYupSchema),
    defaultValues: {
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const onSubmit = (data: EducationFrom) => console.log(data);

  return (
    <div className=" mb-[120px]">
      <ProfileTitle title="Education" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 space-y-[30px]  max-w-[672px] ">
            <InputField
              fieldName={`institution`}
              languageName=""
              isError={!!form.formState.errors?.institution}
              lableName="School/University"
              required={false}
              placeholder="School"
              maxLength={60}
              showLetterCount
            />
            <InputField
              fieldName={`degree`}
              languageName=""
              isError={!!form.formState.errors?.degree}
              lableName="Degree"
              required={false}
              placeholder="Degree"
              maxLength={60}
              showLetterCount
            />
            <div className="flex max-w-[672px] gap-4 ">
              <SelectField
                name={`startDate`}
                placeholder="Year"
                error={!!form.formState.errors?.startDate}
                showRequiredLabel
                labelName="Start Date"
                data={generateYearData()}
                width="w-[50%]"
              />
              <SelectField
                name={`education.endDate`}
                placeholder="Month"
                error={!!form.formState.errors?.endDate}
                showRequiredLabel
                labelName="End Date (Or Expected) "
                data={generateYearData()}
                width="w-[50%]"
              />
            </div>
            <TextAreaField
              key={`education.description`}
              lableName={"Description"}
              isError={!!form.formState.errors?.description}
              fieldName={`description`}
              languageName={""}
              placeholder="Please describe your learning experience."
              required={false}
              fieldHeight={"h-[128px]"}
              maxLength={250}
              showLetterCount
            />
          </div>
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
