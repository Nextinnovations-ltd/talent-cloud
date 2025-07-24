import { Stepper } from "@/components/ui/stepper";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepOneForm from "./StepsForms/StepOneForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


const steps = [
    { title: "Basic Information ", description: "Job title, Company, Location" },
    { title: "Job Details", description: "Description, requirements, type" },
    { title: "Compensation", description: "Salary, benefits, Skill" },
]

const CreateNewJob = () => {
    const [currentStep, setCurrentStep] = useState(0)

  

    return (
        <div className=" py-[44px] w-[calc(100svw-300px)]">
            <h3 className="text-[24px] font-semibold">Post a New Job</h3>
            <p className="text-[#575757] mb-[77px]">Create a amazing opportunity for talented professional.</p>
            <Stepper steps={steps} currentStep={currentStep} />
            <div className="mt-[50px]  rounded-md">
                <h2 className="text-[24px] font-semibold mb-1">Step 1 : Basic Information</h2>
                <p className="text-[#575757] text-[16px]">{steps[currentStep].description}</p>
            </div>
            {
                currentStep === 0 && <StepOneForm/>
            }
            <div className="flex justify-between mt-4">
                <Button className=" text-[#000000] text-[16px]  w-[150px] h-[53px]" variant="outline" onClick={() => setCurrentStep(currentStep - 1)} disabled={currentStep === 0}>
                    <ChevronLeft size={16} className="mr-3" /> Previous
                </Button>
                <Button
                    className="bg-[#0481EF] text-[16px] text-white w-[150px] h-[53px] flex items-center justify-center gap-2"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={currentStep === steps.length - 1}
                >
                    {currentStep === steps.length - 1 ? "Finish" : <>
                        Next <ChevronRight size={16} />
                    </>}
                </Button>

            </div>

        </div>
    )
}

export default CreateNewJob;
