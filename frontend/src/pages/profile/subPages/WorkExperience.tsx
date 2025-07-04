import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import InputField from "@/components/common/form/fields/input-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useApiCaller } from "@/hooks/useApicaller";
import { MONTHDATA } from "@/lib/formData.tsx/CommonData";
import { UserWorkExperienceSchema } from "@/lib/UserWorkExperience";
import { useAddExperienceProfileMutation, useGetExperienceByIdQuery } from "@/services/slices/jobSeekerSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

type JobExperience = {
  organization: string;
  title: string;
  startDateYear: string;
  startDateMonth: string;
  endDateYear?: string;
  endDateMonth?: string;
  is_present_work: boolean;
  description?: string;
};

const generateYearData = (startYear = 2000, endYear = new Date().getFullYear()) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = (startYear + index).toString();
    return { value: year, label: year };
  });
};

const staticYearData = generateYearData();

export const WorkExperience = () => {
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddExperienceProfileMutation);

  // Get id from URL
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  // Fetch experience data if id exists
  type ExperienceType = {
    id: number;
    title: string;
    organization: string;
    job_type?: string;
    work_type?: string;
    start_date: string;
    end_date: string;
    description: string;
    is_present_work: boolean;
  };
  const { data: ExperienceData } = useGetExperienceByIdQuery(id, { skip: !id });

  const form = useForm<JobExperience>({
    resolver: yupResolver(UserWorkExperienceSchema),
    defaultValues: {
      organization: "",
      title: "",
      startDateMonth: "",
      startDateYear: "",
      endDateYear: "",
      endDateMonth: "",
      is_present_work: false,
      description: ""
    },
  });

  const noCurrently = useWatch({
    control: form.control,
    name: "is_present_work",
    defaultValue: false,
  });

  function isExperienceResponse(obj: unknown): obj is { data: ExperienceType } {
    return !!obj && typeof obj === 'object' && 'data' in obj && typeof (obj as { data?: unknown }).data === 'object';
  }

  // Prefill form when ExperienceData is loaded
  useEffect(() => {
    if (isExperienceResponse(ExperienceData)) {
      const exp = ExperienceData.data;
      form.reset({
        organization: exp.organization || "",
        title: exp.title || "",
        startDateYear: exp.start_date?.split("-")[0] || "",
        startDateMonth: exp.start_date?.split("-")[1] || "",
        endDateYear: exp.end_date?.split("-")[0] || "",
        endDateMonth: exp.end_date?.split("-")[1] || "",
        is_present_work: exp.is_present_work || false,
        description: exp.description || "",
      });
    }
  }, [ExperienceData, form]);

  const onSubmit = async (data: JobExperience) => {
    const startDate = new Date(`${data.startDateYear}-${data.startDateMonth}-01`);
    const endDate = data.endDateYear && data.endDateMonth ? new Date(`${data.endDateYear}-${data.endDateMonth}-01`) : null;

    if (endDate && endDate < startDate) {
      form.setError('endDateYear', {
        type: 'manual',
        message: 'Please select valid date!',
      });
      return;
    }

    if (endDate && startDate > endDate) {
      form.setError('endDateYear', {
        type: 'manual',
        message: 'Please select valid date!',
      });
      return;
    }

    if (
      data.startDateYear === data.endDateYear &&
      data.endDateMonth &&
      data.endDateMonth < data.startDateMonth
    ) {

      form.setError('endDateYear', {
        type: 'manual',
        message: 'Please select valid date!',
      });
      return;
    }

    const payload = {
      title: data.title,
      organization: data.organization,
      start_date: `${data.startDateYear}-${data.startDateMonth}-01`,
      end_date: endDate ? `${data.endDateYear}-${data.endDateMonth}-01` : null,
      is_present_work: data.is_present_work,
      description: data.description
    };

    try {
      const response = await executeApiCall(payload);
      if (response?.data?.data) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  useEffect(() => {
    if (noCurrently) {
      form.setValue('endDateMonth', undefined);
      form.setValue('endDateYear', undefined);
    }
  }, [noCurrently]);

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Work Experience" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 space-y-[30px]">
            <InputField
              fieldName={`organization`}
              languageName=""
              isError={!!form.formState.errors?.organization}
              lableName="Name of Company"
              required={true}
              placeholder="Company"
              maxLength={50}
              showLetterCount
            />
            <InputField
              fieldName={`title`}
              languageName=""
              isError={!!form.formState.errors?.title}
              lableName="Job Title"
              required={true}
              placeholder="Position"
              maxLength={50}
              showLetterCount
            />
            <div className="flex max-w-[672px] gap-4">
              <SelectField
                name={`startDateYear`}
                placeholder="Year"
                error={!!form.formState.errors?.startDateYear}
                showRequiredLabel
                isRequired
                labelName="Start Date"
                data={staticYearData} // Use static year data for start year
                width="w-[50%]"
              />
              <SelectField
                name={`startDateMonth`}
                placeholder="Month"
                error={!!form.formState.errors?.startDateMonth}
                showRequiredLabel
                labelName=""
                data={MONTHDATA}
                width="w-[50%] mt-6"
              />
            </div>
            {!noCurrently && (
              <div className="flex max-w-[672px] gap-4">
                <SelectField
                  name={`endDateYear`}
                  placeholder="Year"
                  error={!!form.formState.errors?.endDateYear}
                  showRequiredLabel
                  isRequired
                  labelName="End Date"
                  data={staticYearData} // Use static year data for end year
                  width="w-[50%]"
                />
                <SelectField
                  name={`endDateMonth`}
                  placeholder="Month"
                  error={!!form.formState.errors?.endDateMonth}
                  showRequiredLabel
                  labelName=""
                  data={MONTHDATA}
                  width="w-[50%] mt-6"
                />
              </div>
            )}
            <CustomCheckbox
              form={form}
              fieldName={`is_present_work`}
              text={"I currently work here"}
              typeStyle="mono"
            />
            <TextAreaField
              disabled={false}
              fieldName={'description'}
              placeholder={'A brief introduction about yourself'}
              isError={!!form.formState.errors.description}
              required={false}
              requiredLabel={true}
              languageName={"userProfile"}
              fieldHeight={"h-[128px]"}
              showLetterCount={true}
              maxLength={250}
            />
          </div>

          <div className="max-w-[672px] flex items-center justify-end">
            <Button
              type="submit"
              title="Save Button"
              className="w-[155px] disabled:bg-[#78acda] mt-[30px] h-[48px] bg-[#0389FF] text-white rounded-[30px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};