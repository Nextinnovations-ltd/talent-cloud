import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Form } from "@/components/ui/form";
import { SkillYupSchema } from "@/lib/SkillYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/common/MultiSelect";
import { useEffect } from "react";
import { PageInitialLoading } from "@/components/common/PageInitialLoading";
import { useFormattedSkills, useFormattedUserSkills } from "@/lib/dropData.tsx/ReturnSkills";
import { useApiCaller } from "@/hooks/useApicaller";
import { useAddJobSeekerSkillsMutation } from "@/services/slices/jobSeekerSlice";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useNavigate } from "react-router-dom";

type SkillForm = {
  skill_list: string[];
};

export const Skills = () => {
  const { data: FORMATTEDDATA, isLoading, refetch } = useFormattedSkills();
  const { data: FORMATTEDUSER, isLoading: USERLOADING, refetch: USERREFETCH } = useFormattedUserSkills();
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddJobSeekerSkillsMutation);
  const navigate = useNavigate();

  const form = useForm<SkillForm>({
    resolver: yupResolver(SkillYupSchema),
    defaultValues: {
      skill_list: Array.isArray(FORMATTEDUSER) ? FORMATTEDUSER.map(String) : [],
    },
  });

  // Sync form default values when user data loads
  useEffect(() => {
    if (Array.isArray(FORMATTEDUSER)) {
      form.setValue("skill_list", FORMATTEDUSER.map(String));
    }
  }, [FORMATTEDUSER, form]);

  const onSubmit = async (data: SkillForm) => {
    if (data.skill_list.length < 5) {
      form.setError("skill_list", {
        type: "manual",
        message: "Please select at least 5 skills.",
      });
      return;
    }

    try {
      await executeApiCall(data);
      refetch();
      USERREFETCH();
      //navigate("/user/mainProfile");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (isLoading || USERLOADING) {
    return <PageInitialLoading />;
  }

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Skills" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4 max-w-[672px]">
            <MultiSelect
              options={
                Array.isArray(FORMATTEDDATA)
                  ? FORMATTEDDATA.map((opt) => ({ ...opt, value: String(opt.value) }))
                  : []
              }
              onValueChange={(values) => form.setValue("skill_list", values)}
              defaultValue={form.watch("skill_list")}
              placeholder="eg. Microsoft Office"
              variant="inverted"
              animation={2}
              maxCount={100}
              className="min-h-[56px] max-w-[672px]"
              disabled={isSubmitting}
            />
            {form.formState.errors.skill_list && (
              <p className="text-red-500 mt-1 text-sm">
                {form.formState.errors.skill_list.message}
              </p>
            )}
          </div>

          <div className="max-w-[672px] flex items-center justify-end">
            <Button
              type="submit"
              title="Save Button"
              className="w-[155px] disabled:bg-[#78acda] mt-[30px] h-[48px] bg-[#0389FF] text-white rounded-[30px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : "Update Skills"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
