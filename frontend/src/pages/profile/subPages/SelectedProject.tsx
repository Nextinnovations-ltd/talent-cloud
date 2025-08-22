/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ProfileTitle } from "@/components/common/ProfileTitle";
import SelectedProjectSchema from "@/lib/SelectedProjectSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { useWatch } from "react-hook-form";
import { MONTHDATA } from "@/lib/formData.tsx/CommonData";
import ImagePicker from "@/components/common/ImagePicker";
import { useState } from "react";
import { useAddSelectedProjectsMutation, useUpdateSelectedProjectsMutation, useGetSelectedProjectsByIdQuery } from "@/services/slices/jobSeekerSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import useToast from "@/hooks/use-toast";
import { useEffect } from "react";
import TagInputField from "@/components/common/form/fields/tag-input-field";
import type { ProjdctsWithIdResponse } from '@/services/slices/jobSeekerSlice';


const generateYearData = (startYear = 2000, endYear = new Date().getFullYear()) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return { value: `${year}`, label: year.toString() };
  });
};
const staticYearData = generateYearData();

type SelectedProjectForm = {
  title: string;
  description: string; // <-- make required
  tags?: string[];
  project_url: string;
  project_image_url?: string;
  startDateYear: string;
  startDateMonth: string;
  endDateYear?: string;
  endDateMonth?: string;
  is_ongoing: boolean;
  team_size?: number;
};

const SelectedProject = () => {

  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [addSelectedProject, { isLoading: isAdding }] = useAddSelectedProjectsMutation();
  const [updateSelectedProject, { isLoading: isUpdating }] = useUpdateSelectedProjectsMutation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showNotification } = useToast();
  const id = searchParams.get("id");
  const { data: projectData, isLoading: isFetching } = useGetSelectedProjectsByIdQuery(id, { skip: !id });



  const form = useForm<SelectedProjectForm>({
    resolver: yupResolver(SelectedProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      project_url: '',
      project_image_url: '',
      startDateYear: '',
      startDateMonth: '',
      endDateYear: '',
      endDateMonth: '',
      is_ongoing: false,
      team_size: undefined
    }
  })

  useEffect(() => {

  
      form.reset({
        title: projectData?.data.title || '',
        description: projectData?.data.description || '',
        tags: projectData?.data.tags || [],
        project_url: projectData?.data.project_url || '',
        project_image_url: projectData?.data.project_image_url || '',
        startDateYear: projectData?.data.start_date ? String(projectData?.data.start_date).split("-")[0] : '',
        startDateMonth: projectData?.data.start_date ? String(projectData?.data.start_date).split("-")[1] : '',
        endDateYear: projectData?.data.is_ongoing ? '' : (projectData?.data.end_date ? String(projectData?.data.end_date).split("-")[0] : ''),
        endDateMonth: projectData?.data.is_ongoing ? '' : (projectData?.data.end_date ? String(projectData?.data.end_date).split("-")[1] : ''),
        is_ongoing: projectData?.data.is_ongoing || false,
        team_size: projectData?.data.team_size || undefined,
      });

  }, [ projectData, form]);

  const isOngoing = useWatch({
    control: form.control,
    name: "is_ongoing",
    defaultValue: false,
  });


  const onSubmit = async (data: SelectedProjectForm) => {
    const start_date = `${data.startDateYear}-${data.startDateMonth}-01`;
    const end_date = (!data.is_ongoing && data.endDateYear && data.endDateMonth)
      ? `${data.endDateYear}-${data.endDateMonth}-01`
      : undefined;
    const payload = {
      title: data.title,
      description: data.description || '',
      tags: data.tags || [],
      project_url: data.project_url,
      project_image_url: 'https://cdn.prod.website-files.com/63e230081c53f7989f5e0f64/65856bd55be1304ca16eab25_Portfolio.jpg', //might fix later
      start_date,
      end_date,
      is_ongoing: data.is_ongoing,
      team_size: data.team_size ? Number(data.team_size) : 0,
    };
    try {
      let response;
      if (id) {
        response = await updateSelectedProject({ id, credentials: payload });
      } else {
        response = await addSelectedProject(payload);
      }
      // Type assertion for response
      const res = response as { data?: ProjdctsWithIdResponse };
      if (res && res.data?.status === true) {
        const project = res.data.data;
        form.reset({
          title: project?.title || '',
          description: project?.description || '',
          tags: project?.tags || [],
          project_url: project?.project_url || '',
          project_image_url: project?.project_image_url || '',
          startDateYear: project?.start_date ? String(project?.start_date).split("-")[0] : '',
          startDateMonth: project?.start_date ? String(project?.start_date).split("-")[1] : '',
          endDateYear: project?.is_ongoing ? '' : (project?.end_date ? String(project?.end_date).split("-")[0] : ''),
          endDateMonth: project?.is_ongoing ? '' : (project?.end_date ? String(project?.end_date).split("-")[1] : ''),
          is_ongoing: project?.is_ongoing || false,
          team_size: project?.team_size || undefined,
        });
        showNotification({ message: id ? "Project updated successfully" : "Project added successfully", type: "success" });
        navigate('/user/mainProfile');
      } else {
        showNotification({ message: 'Failed to save project', type: "danger" });
      }
    } catch (error) {
      showNotification({ message: 'Failed to save project', type: "danger" });
      console.error('Failed to save project:', error);
    }
  }

  if(isFetching) return <div><p>Loading...</p></div>

  return (
    <div className=" mb-[120px]">
      <ProfileTitle title="Selected Project" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 space-y-[30px]  max-w-[672px] ">
          <ImagePicker
        setIsOpen={() => {}}
        preview={preview}
        //@ts-ignore
        form={form}
        type="square"
        setPreview={setPreview} />
            <InputField
              fieldName={`title`}
              languageName=""
              isError={!!form.formState.errors?.title}
              lableName="Project Name"
              required={true}
              placeholder="Type here"
              maxLength={60}
              showLetterCount
            />
            <InputField
              fieldName={`project_url`}
              languageName=""
              isError={!!form.formState.errors?.project_url}
              lableName="Project Url"
              required={true}
              placeholder="Type here"
              maxLength={60}
              showLetterCount
            />
            <TagInputField
              fieldName="tags"
              lableName="Tag or Skill"
              required={false}
              maxTags={20}
              maxLength={20}
              placeholder="Type here"
            />
            <p className="text-xs text-gray-500 mt-1 mb-2">Type a tag and press Enter or comma to add. Click × to remove a tag. Max 20 tags, 20 characters each.</p>
             <InputField
              fieldName={`team_size`}
              languageName=""
              isError={!!form.formState.errors?.team_size}
              lableName="Team Size"
              type={'number'}
              required={false}
              placeholder="Type here"
              maxLength={60}
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
                data={staticYearData}
                width="w-[50%]"
              />
              <SelectField
                name={`startDateMonth`}
                placeholder="Month"
                error={!!form.formState.errors?.startDateMonth}
                showRequiredLabel
                labelName=""
                data={MONTHDATA.map(m => ({ ...m, value: m.value }))}
                width="w-[50%] mt-6"
              />
            </div>
            {!isOngoing && (
              <div className="flex max-w-[672px] gap-4">
                <SelectField
                  name={`endDateYear`}
                  placeholder="Year"
                  error={!!form.formState.errors?.endDateYear}
                  showRequiredLabel
                  isRequired
                  labelName="End Date"
                  data={staticYearData}
                  width="w-[50%]"
                />
                <SelectField
                  name={`endDateMonth`}
                  placeholder="Month"
                  error={!!form.formState.errors?.endDateMonth}
                  showRequiredLabel
                  labelName=""
                  data={MONTHDATA.map(m => ({ ...m, value: m.value }))}
                  width="w-[50%] mt-6"
                />
              </div>
            )}

            {form.formState.errors && (form.formState.errors as Record<string, { message?: string; type?: string }>)[""] && (form.formState.errors as Record<string, { message?: string; type?: string }>)[""]?.type === "end-date-after-start-date" && (
              <div className="text-red-500 text-sm mt-1">
               - {(form.formState.errors as Record<string, { message?: string; type?: string }>)[""]?.message}
              </div>
            )}
            <CustomCheckbox
              form={form}
              fieldName={`is_ongoing`}
              text={"This project is ongoing"}
              typeStyle="mono"
            />
            <TextAreaField
              key={`description`}
              lableName={"Description"}
              isError={!!form.formState.errors?.description}
              fieldName={`description`}
              languageName={""}
              placeholder="Please describe your learning experience."
              required={true}
              fieldHeight={"h-[128px]"}
              maxLength={1000}
              showLetterCount
            />
          </div>
          <div className="max-w-[672px]  flex items-center justify-end">
            <button
              type="submit"
              className="mt-4  h-[48px] rounded-[26px] bg-blue-500  text-white px-4 py-2 "
              disabled={isAdding || isUpdating || isFetching}
            >
              {(isAdding || isUpdating || isFetching) ? (id ? "Updating..." : "Saving...") : id ? "Update Project" : "Add Selected Project"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default SelectedProject;