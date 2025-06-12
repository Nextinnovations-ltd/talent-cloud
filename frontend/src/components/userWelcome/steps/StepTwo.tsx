import { StepperTitle } from "@/components/common/StepperTitle";
import StepTwoForm from "../components/StepTwoForm";

export const StepTwo = ({ goToNextStep }: { goToNextStep: any }) => {
  return (
    <div className=" md:mx-0  flex flex-col items-center justify-center  ">
      <StepperTitle title={"Tell us a little about yourself"} />

      <div className=" px-[10px] md:px-[50px] container mx-atuo mt-[50px]">
        <StepTwoForm goToNextStep={goToNextStep} />
      </div>
    </div>
  );
};
