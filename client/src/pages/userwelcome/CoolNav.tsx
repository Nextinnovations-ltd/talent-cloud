import { Button } from "@/components/ui/button";
import { BackIcon } from "@/constants/svgs";
import useToast from "@/hooks/use-toast";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

const CoolNav = (props: any) => {
  const { showNotification } = useToast();
  // Calculate progress as a percentage
  const navigate = useNavigate();
  const progressPercentage = (props.currentStep / props.totalSteps) * 100;

  const handleNextStep = () => {
    const { currentStep, specializationId, nextStep } = props;

    if (currentStep === 6) {
      navigate("/");
      return;
    }

    if (currentStep === 3) {
      if (specializationId === null) {
        showNotification({
          message: "Please select one talent.",
          type: "danger",
        });
        return;
      }
    }

    nextStep();
  };

  console.log(props.currentStep);

  return (
    <div className="w-full">
      <div className="mb-4">
        {/* Progress bar */}
        <div className="relative pt-1  container mx-auto ">
          <div className="flex mb-2 items-center  h-[80px] justify-between">
            {props.currentStep !== 1 && (
              <Button
                onClick={props.previousStep}
                variant="ghost"
                type="button"
                className="relative"
              >
                <BackIcon />
              </Button>
            )}

            <div className="w-[90%] h-[12px] mx-auto bg-gray-200 rounded-full ">
              <div
                className="bg-blue-500 h-[12px] duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            {props.currentStep !== 1 && (
              <Button onClick={handleNextStep} variant="ghost" type="button">
                {props.currentStep !== 6 && (
                  <span
                    className={clsx(
                      "text-md text-[#05060F] font-semibold",
                     ( props.currentStep === 3 && props.specializationId === null) && "text-slate-200"
                    )}
                  >
                    Skip
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoolNav;
