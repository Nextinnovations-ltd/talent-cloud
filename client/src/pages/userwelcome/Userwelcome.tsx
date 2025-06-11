import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StepWizard from "react-step-wizard";
import CoolNav from "./CoolNav";
import { StepOne } from "@/components/userWelcome/steps/StepOne";
import { StepTwo } from "@/components/userWelcome/steps/StepTwo";
import { StepThree } from "@/components/userWelcome/steps/StepThree";
import { StepFour } from "@/components/userWelcome/steps/StepFour";
import { StepFive } from "@/components/userWelcome/steps/StepFive";
import { SpecializationSkillSet } from "@/components/userWelcome/steps/SpecializationSkillSet";

export const Userwelcome = () => {
  const stepWizardRef = useRef<any>(null);
  const [specializationId, setSpecializationId] = useState(null);
  const [isFinished, setFinished] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stepQuery = parseInt(searchParams.get("step") || "1", 10);
    const validStep = stepQuery > 0 && stepQuery <= 6 ? stepQuery : 1;

    setTimeout(() => setIsLoading(false), 100);
  }, [searchParams]);

  const goToNextStep = () => {
    if (stepWizardRef.current) {
      stepWizardRef.current.nextStep();
      if (searchParams.get("step")) {
        searchParams.delete("step");
        setSearchParams(searchParams);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] pb-[50px] overflow-hidden">
      {/* @ts-ignore */}
      <StepWizard
        initialStep={parseInt(searchParams.get("step") || "1", 10)}
        ref={stepWizardRef}
        nav={!isFinished && <CoolNav specializationId={specializationId} />}
      >
        <StepOne goToNextStep={goToNextStep} />
        <StepTwo goToNextStep={goToNextStep} />
        <StepThree
          setSpecializationId={setSpecializationId}
          specializationId={specializationId}
          goToNextStep={goToNextStep}
        />
        <SpecializationSkillSet
          id={specializationId}
          goToNextStep={goToNextStep}
        />
        <StepFour goToNextStep={goToNextStep} />
        <StepFive
          isFinished={isFinished}
          setFinished={setFinished}
          goToNextStep={goToNextStep}
        />
      </StepWizard>
    </div>
  );
};
