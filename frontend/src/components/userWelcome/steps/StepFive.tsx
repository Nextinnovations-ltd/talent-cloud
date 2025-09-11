import { ExperienceCard } from "@/components/common/ExperienceCard";
import { StepperTitle } from "@/components/common/StepperTitle";
import useToast from "@/hooks/use-toast";
import { useApiCaller } from "@/hooks/useApicaller";
import { useOnBoardingMutation } from "@/services/slices/authSlice";
import { useGetProfessionalsQuery } from "@/services/slices/onBoardingSlice";
import confetti from "canvas-confetti";
import LOGO from "@/assets/image 2.svg";

export const StepFive = ({
  isFinished,
  setFinished,
}: {
  goToNextStep: any;
  isFinished: any;
  setFinished: any;
}) => {
  const { data, isLoading } = useGetProfessionalsQuery();
  const { executeApiCall, isLoading: MutationLoading } = useApiCaller(
    useOnBoardingMutation
  );
  const { showNotification } = useToast();

  const handleProfessionalClick = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("experience_level_id", `${id}`);
      formData.append("step", "5");
      localStorage.setItem("isnew", "isnew");

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


  if (isLoading || MutationLoading)
    return (
      <div className="flex flex-col h-[100svh] items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center">
      <StepperTitle title="What’s your professional experience?" />
      <div className="flex flex-col md:flex-row items-center mt-[40px] gap-[30px] justify-center">
        {data?.data.map((item) => (
          <ExperienceCard
            handleClick={() => handleProfessionalClick(item.id)}
            key={item.id}
            active
            title={item.level}
          />
        ))}
      </div>
    </div>
  );
};
