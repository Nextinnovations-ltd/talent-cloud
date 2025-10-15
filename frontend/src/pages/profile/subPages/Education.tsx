/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Form } from "@/components/ui/form";
import { EducationYupSchema } from "@/lib/EducationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import InputField from "@/components/common/form/fields/input-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import { useApiCaller } from "@/hooks/useApicaller";
import { useAddEducationsMutation, useGetEducationByIdQuery, useUpdateEducationMutation } from "@/services/slices/jobSeekerSlice";
import { useEffect,forwardRef, useImperativeHandle } from "react";
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

type EducationProps = {
  eductionId?: number | null;
  setShowDialog: (val: boolean) => void;
};

export const Education = forwardRef<any, EducationProps>(({ eductionId, setShowDialog }, ref) => {
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddEducationsMutation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: educationData = {} as any, isLoading } = useGetEducationByIdQuery(eductionId ?? '', { skip: !eductionId });
  const [updateEducation, { isLoading: isUpdating }] = useUpdateEducationMutation();
  const { showNotification } = useToast()


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
      if (eductionId) {
        // Edit mode: update
        const updatePayload = {
          id: Number(eductionId),
          institution: data.institution,
          degree: data.degree,
          start_date: data.startDate ? `${data.startDate}-01-01` : "",
          end_date: data.endDate ? `${data.endDate}-01-01` : "",
          description: data.description,
          is_currently_attending: data.is_currently_attending ?? false,
        };
        response = await updateEducation({ id: Number(eductionId), credentials: updatePayload });
        //@ts-ignore
        showNotification({ message: response?.data?.message, type: "success" })
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
        setShowDialog(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => {
       //@ts-ignore
      form.handleSubmit(onSubmit)();
    },
  }));

  const LOADING =  isSubmitting || isUpdating;

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="mt-[20px]">
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
              disabled={LOADING}
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
              disabled={LOADING}
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
              <div className="w-[50%]">
                <SelectField
                  name={`endDate`}
                  placeholder="Year"
                  error={!!form.formState.errors?.endDate}
                  showRequiredLabel
                  labelName="End Date (Or Expected)"
                  data={generateYearData()}
                  isRequired
                />
              </div>
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
              disabled={LOADING}
            />
          </div>
        </form>
      </Form>
    </div>
  );
});
