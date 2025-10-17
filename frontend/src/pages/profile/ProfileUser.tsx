/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DialogBox } from "@/components/common/DialogBox";
import { PageInitialLoading } from "@/components/common/PageInitialLoading";
import { ProfileTitle } from "@/components/common/ProfileTitle";
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
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { NavigationConfirmModal } from "@/components/common/NavigationConfirmModal";
import useToast from "@/hooks/use-toast";

export const ProfileUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(
    useAddJobSeekerProfileMutation
  );

  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch,
  } = useGetJobSeekerProfileQuery();

  const form = useForm<UserProfile>({
    //@ts-ignore
    resolver: yupResolver(UserProfileSchema),
    defaultValues: {
      profile_image_url: profileData?.data?.profile_image_url || "",
      name: profileData?.data?.name || "",
      username: profileData?.data?.username || "",
      tagline: profileData?.data?.tagline || "",
      //@ts-expect-error
      role: profileData?.data?.role?.id || "",
      specializations: profileData?.data?.specialization?.id || 0,
      experience_level: profileData?.data?.experience_level?.id || 0,
      experience_years: profileData?.data?.experience_years || 0,
      bio: profileData?.data?.bio || "",
      email: profileData?.data?.email || "",
      phone_number: profileData?.data?.phone_number || "",
      country_code: profileData?.data?.country_code || "+95",
      date_of_birth: profileData?.data?.date_of_birth || "",
      resume_url: profileData?.data?.resume_url || "",
      is_open_to_work: profileData?.data?.is_open_to_work || false,
      facebook_url: profileData?.data?.facebook_url || "",
      linkedin_url: profileData?.data?.linkedin_url || "",
      behance_url: profileData?.data?.behance_url || "",
      portfolio_url: profileData?.data?.portfolio_url || "",
      github_url: profileData?.data?.github_url || "",
      country: profileData?.data?.address?.country?.id?.toString() ?? "",
      city: profileData?.data?.address?.city?.id?.toString() ?? "",
      address: profileData?.data?.address?.address || "",
    },
  });

  // Reset form when profile data loads
  useEffect(() => {
    if (profileData) {
      form.reset({
        profile_image_url: profileData.data?.profile_image_url || "",
        name: profileData.data?.name || "",
        username: profileData.data?.username || "",
        tagline: profileData.data?.tagline || "",
        //@ts-ignore
        role: profileData.data?.role?.id || 0,
        specializations: profileData?.data?.specialization?.id || 0,
        experience_level: profileData.data?.experience_level?.id || 0,
        experience_years: profileData.data?.experience_years || 0,
        bio: profileData.data?.bio || "",
        email: profileData.data?.email || "",
        phone_number: profileData.data?.phone_number || "",
        country_code: profileData.data?.country_code || "+95",
        date_of_birth: profileData.data?.date_of_birth || "",
        resume_url: profileData.data?.resume_url || "",
        is_open_to_work: profileData?.data?.is_open_to_work || false,
        linkedin_url: profileData?.data?.linkedin_url || "",
        behance_url: profileData?.data?.behance_url || "",
        portfolio_url: profileData?.data?.portfolio_url || "",
        facebook_url: profileData?.data?.facebook_url || "",
        github_url: profileData?.data?.github_url || "",
        country: profileData?.data?.address?.country?.id?.toString() ?? "",
        city: profileData?.data?.address?.city?.id?.toString() ?? "",
        address: profileData?.data?.address?.address || "",
      });
    }
    setPreview(profileData?.data?.profile_image_url || "");
  }, [profileData, isProfileLoading, form]);

  // 🔹 Detect unsaved changes
  useEffect(() => {
    if (!profileData?.data) return;

    const defaultValues = {
      profile_image_url: profileData.data?.profile_image_url || "",
      name: profileData.data?.name || "",
      username: profileData.data?.username || "",
      tagline: profileData.data?.tagline || "",
      role: profileData.data?.role?.id || 0,
      specializations: profileData.data?.specialization?.id || 0,
      experience_level: profileData.data?.experience_level?.id || 0,
      experience_years: profileData.data?.experience_years || 0,
      bio: profileData.data?.bio || "",
      email: profileData.data?.email || "",
      phone_number: profileData.data?.phone_number || "",
      country_code: profileData.data?.country_code || "+95",
      date_of_birth: profileData.data?.date_of_birth || "",
      resume_url: profileData.data?.resume_url || "",
      is_open_to_work: profileData.data?.is_open_to_work || false,
      facebook_url: profileData.data?.facebook_url || "",
      linkedin_url: profileData.data?.linkedin_url || "",
      behance_url: profileData.data?.behance_url || "",
      portfolio_url: profileData.data?.portfolio_url || "",
      github_url: profileData.data?.github_url || "",
      country: profileData.data?.address?.country?.id?.toString() ?? "",
      city: profileData.data?.address?.city?.id?.toString() ?? "",
      address: profileData.data?.address?.address || "",
    };

    const subscription = form.watch((currentValues) => {
      const hasChanges =
        JSON.stringify(currentValues) !== JSON.stringify(defaultValues);
      setHasUnsavedChanges(hasChanges);
    });

    return () => subscription.unsubscribe();
  }, [form, profileData]);

  // 🔹 Navigation guard integration
  const { showNotification } = useToast();
  const {
    showConfirmModal,
    confirmNavigation,
    cancelNavigation,
    navigateBypassingGuard,
  } = useNavigationGuard({
    hasUnsavedChanges,
    onConfirmNavigation: () => {
      showNotification({
        message: "Profile changes were discarded.",
        type: "success",
      });
      //@ts-ignore
      form.reset(profileData?.data);
    },
  });

  // 🔹 Handle form submission
  const onSubmitHandler = async (values: UserProfile) => {
    try {
      const {
        country,
        city,
        address,
        role,
        specializations,
        experience_level,
        ...rest
      } = values;

      const formatLocalDate = (date: Date) => {
        const tzOffset = date.getTimezoneOffset() * 60000; // in ms
        const localISO = new Date(date.getTime() - tzOffset).toISOString();
        return localISO.split("T")[0];
      };

      const formattedValues = {
        ...rest,
        country_code: values.country_code || "+95",
        date_of_birth: values.date_of_birth
          ? formatLocalDate(new Date(values.date_of_birth))
          : null,
        address: {
          country_id: country,
          city_id: city,
          address: address,
        },
        role_id: role,
        specialization_id: specializations,
        experience_level_id: experience_level,
      };

      const response = await executeApiCall(formattedValues);

      if (response?.data?.data) {
        const profileUser = response.data.data?.data;
        form.reset({
          profile_image_url: profileUser?.profile_image_url || "",
          name: profileUser?.name || "",
          username: profileUser?.username || "",
          tagline: profileUser?.tagline || "",
          role: profileUser?.role?.id || 0,
          specializations: profileUser?.specialization?.id || 0,
          experience_level: profileUser?.experience_level?.id || 0,
          experience_years: profileUser?.experience_years || 0,
          bio: profileUser?.bio || "",
          email: profileUser?.email || "",
          phone_number: profileUser?.phone_number || "",
          country_code: profileUser?.country_code || "+95",
          date_of_birth: profileUser?.date_of_birth || "",
          resume_url: profileUser?.resume_url || "",
          is_open_to_work: profileUser?.is_open_to_work || false,
          facebook_url: profileUser?.facebook_url || "",
          linkedin_url: profileUser?.linkedin_url || "",
          behance_url: profileUser?.behance_url || "",
          portfolio_url: profileUser?.portfolio_url || "",
          github_url: profileUser?.github_url || "",
          country: profileUser?.address?.country?.id?.toString() ?? "",
          city: profileUser?.address?.city?.id?.toString() ?? "",
          address: profileUser?.address?.address || "",
        });
        refetch();
        navigateBypassingGuard("/user/mainProfile");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isProfileLoading) {
    return <PageInitialLoading />;
  }

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Profile" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitHandler as any)}
          className="space-y-[30px] my-4"
        >
          <UserProfileForm
            form={form}
            setPreview={setPreview}
            preview={preview}
            setIsOpen={setIsOpen}
            isSubmitting={isSubmitting}
          />
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

      {/* 🔹 Unsaved changes modal */}
      <NavigationConfirmModal
        isOpen={showConfirmModal}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
        title="Unsaved Changes"
        description="You have unsaved changes in your profile. Are you sure you want to leave without saving?"
      />
    </div>
  );
};
