/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Form } from "@/components/ui/form";
import { EducationYupSchema } from "@/lib/EducationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputField from "@/components/common/form/fields/input-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import { useApiCaller } from "@/hooks/useApicaller";
import { useAddEducationsMutation, useGetEducationByIdQuery, useUpdateEducationMutation } from "@/services/slices/jobSeekerSlice";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from "react";
import useToast from "@/hooks/use-toast";


type EducationFrom = {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
  is_currently_attending?: boolean;
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
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddEducationsMutation);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: educationData = {} as any, isLoading } = useGetEducationByIdQuery(id ?? '', { skip: !id });
  const [updateEducation, { isLoading: isUpdating }] = useUpdateEducationMutation();
  const {showNotification} = useToast()


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

  useEffect(() => {
    if (educationData && Object.keys(educationData).length > 0) {
      form.reset({
        institution: educationData.institution || "",
        degree: educationData.degree || "",
        startDate: educationData.start_date ? educationData.start_date.split("-")[0] : "",
        endDate: educationData.end_date ? educationData.end_date.split("-")[0] : "",
        description: educationData.description || "",
        is_currently_attending: educationData.is_currently_attending ?? false,
      });
    }
  }, [educationData, form]);

  const onSubmit = async (data: EducationFrom) => {
    try {
      let response;
      if (id) {
        // Edit mode: update
        const updatePayload = {
          id: Number(id),
          institution: data.institution,
          degree: data.degree,
          start_date: data.startDate ? `${data.startDate}-01-01` : "",
          end_date: data.endDate ? `${data.endDate}-01-01` : "",
          description: data.description,
          is_currently_attending: data.is_currently_attending ?? false,
        };
        response = await updateEducation({ id: Number(id), credentials: updatePayload });
         //@ts-ignore
        showNotification({message:response?.data?.message,type:"success"})
      } else {
        // Create mode: add
        const addPayload = {
          institution: data.institution,
          degree: data.degree,
          start_date: data.startDate ? `${data.startDate}-01-01` : "",
          end_date: data.endDate ? `${data.endDate}-01-01` : "",
          description: data.description,
          is_currently_attending: data.is_currently_attending ?? false,
        };
        response = await executeApiCall(addPayload);
      }
      if (response) {
       
        navigate('/user/mainProfile');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoading) return <p>Loading...</p>;

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
              required={true}
              placeholder="School"
              maxLength={60}
              showLetterCount
            />
            <InputField
              fieldName={`degree`}
              languageName=""
              isError={!!form.formState.errors?.degree}
              lableName="Degree"
              required={true}
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
                isRequired
              />
              <SelectField
                name={`endDate`}
                placeholder="Month"
                error={!!form.formState.errors?.endDate}
                showRequiredLabel
                labelName="End Date (Or Expected) "
                data={generateYearData()}
                width="w-[50%]"
                isRequired
              />
            </div>
            <TextAreaField
              key={`description`}
              lableName={"Description"}
              isError={!!form.formState.errors?.description}
              fieldName={`description`}
              languageName={""}
              placeholder="Please describe your learning experience."
              required={true}
              fieldHeight={"h-[128px]"}
              maxLength={250}
              showLetterCount
            />
          </div>
          <div className="max-w-[672px]  flex items-center justify-end">
            <button
              type="submit"
              className="mt-4  h-[48px] rounded-[26px] bg-blue-500  text-white px-4 py-2 "
              disabled={isSubmitting || isUpdating}
            >
              {(isSubmitting || isUpdating) ? "Saving..." : id ? "Update Education" : "Save Profile"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
