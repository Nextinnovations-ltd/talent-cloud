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

  console.log({profileData})



 
  const form = useForm<UserProfile>({
    resolver: yupResolver(UserProfileSchema),
    defaultValues: {
      profile_image_url: profileData?.data?.profile_image_url || "",
      name: profileData?.data?.name || "",
      username: profileData?.data?.username || "",
      tagline: profileData?.data?.tagline || "",
      role: profileData?.data?.role?.id || 0,
      specializations:profileData?.data?.specialization?.id || 0,
      experience_level: profileData?.data?.experience_level?.id || 0,
      experience_years: profileData?.data?.experience_years || 0,
      bio: profileData?.data?.bio || "",
      email: profileData?.data?.email || "",
      phone_number: profileData?.data?.phone_number || "",
      country_code: profileData?.data?.country_code || "",
      date_of_birth: profileData?.data?.date_of_birth || "",
      resume_url: profileData?.data?.resume_url || "",
      is_open_to_work:profileData?.data?.is_open_to_work || false,
      facebook_url:profileData?.data?.facebook_url || "",
      linkedin_url:profileData?.data?.linkedin_url || "",
      behance_url:profileData?.data?.behance_url || "",
      portfolio_url:profileData?.data?.portfolio_url || "",
      github_url:profileData?.data?.github_url || "",
      country:profileData?.data?.address?.country?.id || undefined,
      city:profileData?.data?.address?.city?.id || undefined ,
      address: profileData?.data?.address?.address || "",
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
        specializations:profileData?.data?.specialization?.id || 0,
        experience_level: profileData.data?.experience_level?.id || 0,
        experience_years: profileData.data?.experience_years || 0,
        bio: profileData.data?.bio || "",
        email: profileData.data?.email || "",
        phone_number: profileData.data?.phone_number || "",
        country_code: profileData.data?.country_code || "",
        date_of_birth: profileData.data?.date_of_birth || "",
        resume_url: profileData.data?.resume_url || "",
        is_open_to_work:profileData?.data?.is_open_to_work || false,
        linkedin_url:profileData?.data?.linkedin_url || "",
        behance_url:profileData?.data?.behance_url || "",
        portfolio_url:profileData?.data?.portfolio_url || "",
        facebook_url:profileData?.data?.facebook_url || "",
        github_url:profileData?.data?.github_url || "",
        country:profileData?.data?.address?.country?.id || 0,
        city:profileData?.data?.address?.city?.id || 0,
        address: profileData?.data?.address?.address || "",
      });
    }
  }, [profileData, isProfileLoading, form]);


  const onSubmitHandler = async (values: UserProfile) => {
    try {
      // Destructure to remove flat address fields
      const { country, city, address,role,specializations, ...rest } = values;
      // Convert date_of_birth to YYYY-MM-DD format if it exists
      const formattedValues = {
        ...rest,
        date_of_birth: values.date_of_birth 
          ? new Date(values.date_of_birth).toISOString().split('T')[0]
          : null,
        address: {
          country_id: country,
          city_id: city,
          address: address,
        },
        role_id:role,
        specialization_id:specializations

      };

      const response = await executeApiCall(formattedValues);


      if (response?.data?.data) {
        form.reset({
          profile_image_url: response.data.data?.profile_image_url || "",
          name: response.data.data?.name || "",
          username: response.data.data?.username || "",
          tagline: response.data.data?.tagline || "",
          role: response.data.data?.role?.id || 0,
          specializations:profileData?.data?.specialization?.id || 0,
          experience_level: response.data.data?.experience_level?.id || 0,
          experience_years: response.data.data?.experience_years || 0,
          bio: response.data.data?.bio || "",
          email: response.data.data?.email || "",
          phone_number: response.data.data?.phone_number || "",
          country_code: response.data.data?.country_code || "",
          date_of_birth: response.data.data?.date_of_birth || "",
          resume_url: response.data.data?.resume_url || "",
          is_open_to_work:profileData?.data?.is_open_to_work || false,
          facebook_url:profileData?.data?.facebook_url || "",
          linkedin_url:profileData?.data?.linkedin_url || "",
          behance_url:profileData?.data?.behance_url || "",
          portfolio_url:profileData?.data?.portfolio_url || "",
          github_url:profileData?.data?.github_url || "",
          country:profileData?.data?.address?.country?.id || 0,
          city:profileData?.data?.address?.city?.id || 0,
          address: profileData?.data?.address?.address || "",
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