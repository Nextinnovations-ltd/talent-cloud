/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import SelectedProjectSchema from "@/lib/SelectedProjectSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { MONTHDATA } from "@/lib/formData.tsx/CommonData";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import {
  useAddSelectedProjectsMutation,
  useUpdateSelectedProjectsMutation,
  useGetSelectedProjectsByIdQuery,
} from "@/services/slices/jobSeekerSlice";
import useToast from "@/hooks/use-toast";
import TagInputField from "@/components/common/form/fields/tag-input-field";
import type { ProjdctsWithIdResponse } from "@/services/slices/jobSeekerSlice";
import uploadToS3 from "@/lib/UploadToS3/UploadToS3";
import ModalImagePicker from "@/components/common/ModalImagePicker";

const generateYearData = (startYear = 2000, endYear = new Date().getFullYear()) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return { value: `${year}`, label: year.toString() };
  });
};
const staticYearData = generateYearData();

type SelectedProjectForm = {
  title: string;
  description: string;
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

type SelectedProjectProps = {
  projectId?: number | null;
  setShowDialog: (val: boolean) => void;
};

const SelectedProject = forwardRef<any, SelectedProjectProps>(({ projectId, setShowDialog }, ref) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [formVersion, setFormVersion] = useState(0); // bump to force remount of textarea
  const [addSelectedProject, { isLoading: isAdding }] = useAddSelectedProjectsMutation();
  const [updateSelectedProject, { isLoading: isUpdating }] = useUpdateSelectedProjectsMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useToast();

  const { data: projectData, isLoading: isFetching } = useGetSelectedProjectsByIdQuery(
    projectId as number | string | null,
    {
      skip: !projectId,
    }
  );

  const form = useForm<SelectedProjectForm>({
    resolver: yupResolver(SelectedProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: [],
      project_url: "",
      project_image_url: "",
      startDateYear: "",
      startDateMonth: "",
      endDateYear: "",
      endDateMonth: "",
      is_ongoing: false,
      team_size: undefined,
    },
  });

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)();
    },
  }));

  useEffect(() => {
    if (projectData?.data) {
      form.reset({
        title: projectData.data.title || "",
        description: projectData.data.description || "",
        tags: projectData.data.tags || [],
        project_url: projectData.data.project_url || "",
        project_image_url: projectData.data.project_image_url || "",
        startDateYear: projectData.data.start_date
          ? String(projectData.data.start_date).split("-")[0]
          : "",
        startDateMonth: projectData.data.start_date
          ? String(projectData.data.start_date).split("-")[1]
          : "",
        endDateYear: projectData.data.is_ongoing
          ? ""
          : projectData.data.end_date
            ? String(projectData.data.end_date).split("-")[0]
            : "",
        endDateMonth: projectData.data.is_ongoing
          ? ""
          : projectData.data.end_date
            ? String(projectData.data.end_date).split("-")[1]
            : "",
        is_ongoing: projectData.data.is_ongoing || false,
        team_size: projectData.data.team_size || undefined,
      });

      setPreview(projectData.data.project_image_url || null);

      // Force re-validation / re-render of those fields so the letter counts update
      // and bump formVersion so TextAreaField remounts (initializes internal count)
      setTimeout(() => {
        form.trigger(["title", "project_url", "description"]);
        setFormVersion((v) => v + 1);
      }, 0);
    }
  }, [projectData, form]);

  const isOngoing = useWatch({
    control: form.control,
    name: "is_ongoing",
    defaultValue: false,
  });



  const onSubmit = async (data: SelectedProjectForm) => {


    setIsLoading(true);

    const start_date = `${data.startDateYear}-${data.startDateMonth}-01`;
    const end_date =
      !data.is_ongoing && data.endDateYear && data.endDateMonth
        ? `${data.endDateYear}-${data.endDateMonth}-01`
        : undefined;

    const payload: any = {
      title: data.title,
      description: data.description || "",
      tags: data.tags || [],
      project_url: data.project_url,
      start_date,
      end_date,
      is_ongoing: data.is_ongoing,
      team_size: data.team_size ? Number(data.team_size) : 0,
    };

    try {
      const uploadResult = await uploadToS3({
        file: form.getValues("project_image_url") as unknown as File,
        type: "project",
      });




      if (uploadResult) {
        payload.project_image_upload_id = uploadResult;
      }

      const response = projectId
        ? await updateSelectedProject({ id: projectId, credentials: payload })
        : await addSelectedProject(payload);

      const res = response as { data?: ProjdctsWithIdResponse };

      if (res && res.data?.status === true) {
        const project = res.data.data;
        form.reset({
          title: project?.title || "",
          description: project?.description || "",
          tags: project?.tags || [],
          project_url: project?.project_url || "",
          project_image_url: project?.project_image_url || "",
          startDateYear: project?.start_date ? String(project?.start_date).split("-")[0] : "",
          startDateMonth: project?.start_date ? String(project?.start_date).split("-")[1] : "",
          endDateYear: project?.is_ongoing
            ? ""
            : project?.end_date
              ? String(project?.end_date).split("-")[0]
              : "",
          endDateMonth: project?.is_ongoing
            ? ""
            : project?.end_date
              ? String(project?.end_date).split("-")[1]
              : "",
          is_ongoing: project?.is_ongoing || false,
          team_size: project?.team_size || undefined,
        });

        // After save, re-trigger and bump the formVersion so textarea updates
        setTimeout(() => {
          form.trigger(["title", "project_url", "description"]);
          setFormVersion((v) => v + 1);
        }, 0);

        showNotification({
          message: projectId ? "Project updated successfully" : "Project added successfully",
          type: "success",
        });
        setShowDialog(false);
      } else {
        showNotification({ message: "Failed to save project", type: "danger" });
      }
    } catch (error) {
      showNotification({ message: "Failed to save project", type: "danger" });
      console.error("Failed to save project:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const loading = isAdding || isUpdating || isFetching || isLoading;

  if (isFetching) return <div><p>Loading...</p></div>;

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 space-y-[30px] max-w-[672px] ">
            {/* <ImagePicker
              setIsOpen={() => {}}
              preview={preview}
              //@ts-ignore
              form={form}
              type="square"
              imageUploadType="project"
              setPreview={setPreview}
            /> */}
            <ModalImagePicker
              preview={preview}
              setPreview={setPreview}
              //@ts-ignore
              form={form}
              imageUploadType="project" />
            <InputField
              fieldName={`title`}
              languageName=""
              isError={!!form.formState.errors?.title}
              lableName="Project Name"
              required
              placeholder="Type here"
              maxLength={60}
              showLetterCount
              disabled={loading}
            />
            <InputField
              fieldName={`project_url`}
              languageName=""
              isError={!!form.formState.errors?.project_url}
              lableName="Project Url"
              required
              placeholder="Type here"
              maxLength={120}
              showLetterCount
              disabled={loading}
            />
            <TagInputField
              fieldName="tags"
              lableName="Tag or Skill"
              required={false}
              maxTags={20}
              maxLength={20}
              placeholder="Type here"
            />
            <p className="text-sm text-gray-500 mt-1 mb-2">
              Type a tag and press Enter or comma to add. Click × to remove a tag. Max 20 tags, 20
              characters each.
            </p>
            <InputField
              fieldName={`team_size`}
              languageName=""
              isError={!!form.formState.errors?.team_size}
              lableName="Team Size"
              type="number"
              placeholder="Type here"
              maxLength={3}
              showLetterCount
              disabled={loading}
              required={false}
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
                data={MONTHDATA.map((m) => ({ ...m, value: m.value }))}
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
                  data={MONTHDATA.map((m) => ({ ...m, value: m.value }))}
                  width="w-[50%] mt-6"
                />
              </div>
            )}

            <CustomCheckbox
              form={form}
              fieldName={`is_ongoing`}
              text={"This project is ongoing"}
              typeStyle="mono"
            />

            {/* TEXTAREA: key includes formVersion so it remounts after reset and re-initializes internal count */}
            <TextAreaField
              key={`description-${formVersion}`}
              lableName={"Description"}
              isError={!!form.formState.errors?.description}
              fieldName={`description`}
              languageName={""}
              placeholder="Please describe your learning experience."
              required
              fieldHeight={"h-[128px]"}
              maxLength={1000}
              showLetterCount
              disabled={loading}
            />
          </div>
        </form>
      </Form>
    </div>
  );
});

export default SelectedProject;
