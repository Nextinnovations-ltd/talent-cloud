import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Form } from "@/components/ui/form";
import { SkillYupSchema } from "@/lib/SkillYupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/common/MultiSelect";
import { useEffect, useState } from "react";
import { PageInitialLoading } from "@/components/common/PageInitialLoading";
import { useFormattedSkills, useFormattedUserSkills } from "@/lib/dropData.tsx/ReturnSkills";
import { useApiCaller } from "@/hooks/useApicaller";
import { useAddJobSeekerSkillsMutation } from "@/services/slices/jobSeekerSlice";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";



type SkillForm = {
  skill_list: string[];
};

export const Skills = () => {
  const { data: FORMATTEDDATA, isLoading, refetch } = useFormattedSkills();
  const { data: FORMATTEDUSER, isLoading: USERLOADING, refetch: USERREFETCH } = useFormattedUserSkills();
  const { executeApiCall, isLoading: isSubmitting } = useApiCaller(useAddJobSeekerSkillsMutation);

  const form = useForm<SkillForm>({
    resolver: yupResolver(SkillYupSchema),
  });

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(
    Array.isArray(FORMATTEDUSER) ? FORMATTEDUSER.map(String) : []
  );

  useEffect(() => {
    if (Array.isArray(FORMATTEDUSER) && FORMATTEDUSER.length > 0) {
      setSelectedFrameworks(FORMATTEDUSER.map(String));
    }
  }, [FORMATTEDUSER]);

  useEffect(() => {
    if (Array.isArray(selectedFrameworks) && selectedFrameworks.length > 0) {
      form.setValue('skill_list', selectedFrameworks);
    }
  }, [selectedFrameworks]);

  const onSubmit = async (data: SkillForm) => {
    try {
      await executeApiCall(data);
      refetch()
      USERREFETCH()

    } catch (error) {
      console.error("Error submitting from:", error);
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
              options={Array.isArray(FORMATTEDDATA) ? FORMATTEDDATA.map(opt => ({ ...opt, value: String(opt.value) })) : []}
              onValueChange={setSelectedFrameworks}
              defaultValue={selectedFrameworks}
              placeholder="eg. Microsoft Office"
              variant="inverted"
              animation={2}
              maxCount={100}
              className="min-h-[56px] max-w-[672px]"
            />
          </div>

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
        </form>
      </Form>
    </div>
  );
};