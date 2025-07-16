import { useState } from "react";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { SkillSetButton } from "@/components/common/SkillSetButton";
import { StepperTitle } from "@/components/common/StepperTitle";
import useToast from "@/hooks/use-toast";
import SkillSetSkeleton from "@/components/common/SkillSetSkeleton";
import { useGetSkillSetsQuery } from "@/services/slices/onBoardingSlice";
import { useApiCaller } from "@/hooks/useApicaller";
import { useOnBoardingMutation } from "@/services/slices/authSlice";
import LOGO from "@/assets/image 2.svg";
import confetti from "canvas-confetti";


export const StepFour = ({ 
  isFinished,
  setFinished,
 }: {
    isFinished: boolean;
    setFinished: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
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
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight - 150;

        confetti({
          particleCount: 200,
          startVelocity: 60,
          spread: 180,
          origin: {
            x: centerX / window.innerWidth,
            y: centerY / window.innerHeight - 0.2,
          },
          gravity: 0.8,
          decay: 0.9,
          scalar: 1,
        });

        setFinished(true);

        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
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

  if (isFinished)
    return (
      <div className="flex flex-col h-[100svh] items-center justify-center">
        <div>
          <img className="animate-fade" src={LOGO} alt="logo" />
        </div>
        <h3 className="font-semibold text-center text-[28px] mt-[25px]">
          Congratulations
          <br />
          <span className="text-[24px] text-[#8C8C8C]">
            Welcome to Talent Cloud
          </span>
        </h3>
      </div>
    );

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
