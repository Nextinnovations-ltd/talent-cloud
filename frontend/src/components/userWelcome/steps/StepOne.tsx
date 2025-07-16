import { PrimaryButton } from "@/components/common/PrimaryButton";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


export const StepOne = ({ goToNextStep }: { goToNextStep: any }) => {

  const handleNextStep = () => {
    

    // confetti({
    //   particleCount: 100,
    //   startVelocity: 30,
    //   spread: 360,
    //   origin: {
    //     x: Math.random(),
    //     // since they fall down, start a bit higher than random
    //     y: Math.random() - 0.2
    //   }
    // });

    goToNextStep();
  };

  return (
    <div className="  flex-col gap-[10px] h-[70svh]  px-[20px] md:mx-0  flex items-center justify-center  ">
      <Card className="md:w-[506px] space-y-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            <h3>Welcome to Talent Cloud</h3>
          </CardTitle>
          <CardDescription className="max-w-[366px] mx-auto mt-[14px]">
            To personalize your experience, we’ll ask you a few questions.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <PrimaryButton
            handleClick={handleNextStep}
            title="Get started"
            isButtonDisabled={false}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
