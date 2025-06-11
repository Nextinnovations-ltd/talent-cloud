import { useState } from "react";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SkillSetButton } from "@/components/common/SkillSetButton";
import { StepperTitle } from "@/components/common/StepperTitle";
import useToast from "@/hooks/use-toast";
import SkillSetSkeleton from "@/components/common/SkillSetSkeleton";
import { useGetSkillSetsQuery } from "@/services/slices/onBoardingSlice";
import { useApiCaller } from "@/hooks/useApicaller";
import { useOnBoardingMutation } from "@/services/slices/authSlice";

export const StepFour = ({ goToNextStep }: { goToNextStep: any }) => {
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const { data, isLoading } = useGetSkillSetsQuery();
  const { showNotification } = useToast();
  const { executeApiCall, isLoading: MutationLoading } = useApiCaller(
    useOnBoardingMutation
  );

  const handleSkillClick = (id: number) => {
    if (selectedSkills.includes(id)) {
      setSelectedSkills((prev) => prev.filter((skillId) => skillId !== id));
    } else {
      setSelectedSkills((prev) => [...prev, id]);
    }
  };

  const handleNextStep = async () => {
    if (selectedSkills.length < 5) {
      showNotification({
        message: "Please select at least 5 skills before saving.",
        type: "danger",
      });
      return;
    }

    try {
      const formData = new FormData();

      formData.append("skill_id_list", `[${selectedSkills}]`);
      formData.append("industry_id", "1");
      formData.append("step", "4");

      const res = await executeApiCall(formData);

      if (res.success) {
        goToNextStep();
      } else {
        showNotification({
          message: "Something went wrong. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error during API call:", error);
      showNotification({
        message: "An error occurred while processing your request.",
        type: "danger",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <StepperTitle title={"Which skill sets you have?"} />
      <div className="container flex flex-col justify-center items-center gap-[10px] mx-auto mt-[40px]">
        <div className="flex flex-wrap px-[150px]  items-center justify-center gap-[10px]">
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <SkillSetSkeleton key={index} />
            ))}
          {!isLoading &&
            data?.data.map((data) => (
              <SkillSetButton
                key={data.id}
                title={data.title}
                isSelected={selectedSkills.includes(data.id)}
                onClick={() => handleSkillClick(data.id)}
              />
            ))}
        </div>
        <PrimaryButton
          handleClick={handleNextStep}
          width="w-[200px] mt-[50px]"
          title="Save 5 or more"
          loading={isLoading || MutationLoading}
          isButtonDisabled={
            isLoading || MutationLoading || selectedSkills.length < 5
          }
        />
      </div>
    </div>
  );
};
