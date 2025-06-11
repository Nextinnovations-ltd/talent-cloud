import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "@/components/common/form/fields/input-field";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useApiCaller } from "@/hooks/useApicaller";
import { socialLinkFields } from "@/lib/formData.tsx/UserProfile";
import { PortfolioYupSchema } from "@/lib/PortfolioSchema";
import { useAddSocialProfileMutation, useGetSocialLinkQuery } from "@/services/slices/jobSeekerSlice";
import { PageInitialLoading } from "@/components/common/PageInitialLoading";

type SocialLinksForm = {
    [key: string]: string | undefined;
    facebook_url?: string;
    linkedin_url?: string;
    behance_url?: string;
    portfolio_url?: string;
    github_url?: string;
};

export const SocialLinks = () => {
    const { data: socialData, refetch, isLoading } = useGetSocialLinkQuery();
    const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddSocialProfileMutation);
    

    const form = useForm<SocialLinksForm>({
        resolver: yupResolver(PortfolioYupSchema),
        defaultValues: socialData?.data || {}
    });

    useEffect(() => {
        if (socialData?.data) {
            form.reset(socialData.data);
        }
    }, [socialData, form]);

    const onSubmit = async (values: SocialLinksForm) => {
        try {
            const response = await executeApiCall(values);

            if (response?.data?.data) {
                form.reset(response.data.data);
                refetch();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    if (isLoading) {
        return (
            <PageInitialLoading />
        );
    }

    return (
        <div className="mb-[120px]">
            <ProfileTitle title="Social Links" />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="mb-4 space-y-[30px] max-w-[672px]">
                        {socialLinkFields.map((field) => (
                            <InputField
                                key={field.fieldName}
                                fieldName={field.fieldName}
                                isError={field.isError?.(form)}
                                startIcon={field.startIcon}
                                languageName={"userProfile"}
                                required={false}
                                placeholder=""
                            />
                        ))}
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
        </div>
    );
};