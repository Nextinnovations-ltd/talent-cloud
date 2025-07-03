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
      profile_image_url: profileData?.data?.profile_image_url || "",
      name: profileData?.data?.name || "",
      username: profileData?.data?.username || "",
      tagline: profileData?.data?.tagline || "",
      role: profileData?.data?.role?.id || 0,
      experience_level: profileData?.data?.experience_level?.id || 0,
      experience_years: profileData?.data?.experience_years || 0,
      bio: profileData?.data?.bio || "",
      email: profileData?.data?.email || "",
      phone_number: profileData?.data?.phone_number || "",
      country_code: profileData?.data?.country_code || "",
      date_of_birth: profileData?.data?.date_of_birth || "",
      address: profileData?.data?.address || "",
      resume_url: profileData?.data?.resume_url || "",
    },
  });

  useEffect(() => {
    if (profileData) {


      form.reset({
        profile_image_url: profileData.data?.profile_image_url || "",
        name: profileData.data?.name || "",
        username: profileData.data?.username || "",
        tagline: profileData.data?.tagline || "",
        role: profileData.data?.role?.id || 0,
        experience_level: profileData.data?.experience_level?.id || 0,
        experience_years: profileData.data?.experience_years || 0,
        bio: profileData.data?.bio || "",
        email: profileData.data?.email || "",
        phone_number: profileData.data?.phone_number || "",
        country_code: profileData.data?.country_code || "",
        date_of_birth: profileData.data?.date_of_birth || "",
        address: profileData.data?.address || "",
        resume_url: profileData.data?.resume_url || "",
      });
    }
  }, [profileData,isProfileLoading]);


  useEffect(()=>{
    console.log("Form Values:", form.getValues());
  },[form.getValues()]);


  const onSubmitHandler = async (values: UserProfile) => {
    try {
      // Convert date_of_birth to YYYY-MM-DD format if it exists
      const formattedValues = {
        ...values,
        date_of_birth: values.date_of_birth 
          ? new Date(values.date_of_birth).toISOString().split('T')[0]
          : null,
      };

      const response = await executeApiCall(formattedValues);


      if (response?.data?.data) {
        form.reset({
          profile_image_url: response.data.data?.profile_image_url || "",
          name: response.data.data?.name || "",
          username: response.data.data?.username || "",
          tagline: response.data.data?.tagline || "",
          role: response.data.data?.role?.id || 0,
          experience_level: response.data.data?.experience_level?.id || 0,
          experience_years: response.data.data?.experience_years || 0,
          bio: response.data.data?.bio || "",
          email: response.data.data?.email || "",
          phone_number: response.data.data?.phone_number || "",
          country_code: response.data.data?.country_code || "",
          date_of_birth: response.data.data?.date_of_birth || "",
          address: response.data.data?.address || "",
          resume_url: response.data.data?.resume_url || "",
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
            form={form}
            setPreview={setPreview}
            preview={preview}
            setIsOpen={setIsOpen}
            />
         
          <div className="mt-[60px] ">
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