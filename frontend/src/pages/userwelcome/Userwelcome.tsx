import { useRef, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StepWizard from "react-step-wizard";
import CoolNav from "./CoolNav";
import { StepOne } from "@/components/userWelcome/steps/StepOne";
import { StepTwo } from "@/components/userWelcome/steps/StepTwo";
import { StepThree } from "@/components/userWelcome/steps/StepThree";
import { StepFour } from "@/components/userWelcome/steps/StepFour";
import { SpecializationSkillSet } from "@/components/userWelcome/steps/SpecializationSkillSet";

interface StepWizardRef {
  nextStep: () => void;
}

export const Userwelcome = () => {
  const stepWizardRef = useRef<StepWizardRef>(null);
  const [specializationId, setSpecializationId] = useState<number | null>(null);
  const [isFinished, setFinished] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
      <StepWizard
        initialStep={parseInt(searchParams.get("step") || "1", 10)}
        // @ts-expect-error - react-step-wizard ref type issue
        ref={stepWizardRef}
        nav={!isFinished ? <CoolNav specializationId={specializationId} /> : undefined}
      >
        <StepOne goToNextStep={goToNextStep} />
        <StepTwo goToNextStep={goToNextStep} />
        <StepThree
          setSpecializationId={(id: number) => setSpecializationId(id)}
          specializationId={specializationId}
          goToNextStep={goToNextStep}
        />
        <SpecializationSkillSet
          id={specializationId}
          goToNextStep={goToNextStep}
        />
        <StepFour  isFinished={isFinished}
          setFinished={setFinished} />
       
      </StepWizard>
    </div>)

};


//<StepFive
//isFinished={isFinished}
//setFinished={setFinished}
//goToNextStep={goToNextStep}
///>