import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageInitialLoading } from "@/components/common/PageInitialLoading";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserProfileForm } from "@/components/userSetting/userProfileForm";
import { useApiCaller } from "@/hooks/useApicaller";
import { MODALDATAS } from "@/lib/ModalDatas";
import { UserProfileSchema } from "@/lib/UserProfileSchema";
import {
  useAddJobSeekerProfileMutation,
  useGetJobSeekerProfileQuery,
} from "@/services/slices/jobSeekerSlice";
import { UserProfile } from "@/types/job-seeker-types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


export const ProfileUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);

  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(
    useAddJobSeekerProfileMutation
  );
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetJobSeekerProfileQuery();

  const form = useForm<UserProfile>({
    resolver: yupResolver(UserProfileSchema),
    defaultValues: {
      ...profileData?.data,
      specialization_id: profileData?.data?.specialization?.id,
      experience_level_id: profileData?.data?.experience_level?.id,
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        ...profileData.data,
        specialization_id: profileData.data?.specialization?.id,
        experience_level_id: profileData.data?.experience_level?.id,
      });
    }
  }, [profileData, form]);

  const onSubmitHandler = async (values: UserProfile) => {
    try {
      const response = await executeApiCall(values);

      if (response?.data?.data) {
        form.reset({
          ...response.data.data,
          specialization_id: response.data.data.specialization?.id,
          experience_level_id: response.data.data.experience_level?.id,
        });
        refetch();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isProfileLoading) {
    return (
      <PageInitialLoading />
    );
  }

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Profile" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler)}
          className="space-y-[30px]  my-4"
        >
          <UserProfileForm
            preview={preview}
            setPreview={setPreview}
            form={form}
            setIsOpen={setIsOpen}
          />
          <div className="mt-[60px]">
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
          </div>
        </form>
      </Form>
      <DialogBox
        title={MODALDATAS[0].PROFILEREMOVE.title}
        description={MODALDATAS[0].PROFILEREMOVE.description}
        negative={MODALDATAS[0].PROFILEREMOVE.negative}
        action={MODALDATAS[0].PROFILEREMOVE.action}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleAction={() => {
          setPreview("");
          setIsOpen(false);
        }}
      />
    </div>
  );
};