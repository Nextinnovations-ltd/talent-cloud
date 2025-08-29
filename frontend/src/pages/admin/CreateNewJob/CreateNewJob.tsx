/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Stepper } from "@/components/ui/stepper";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StepOneForm from "./StepsForms/StepOneForm";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { StepOneFormYupSchema, StepThreeFormYupSchema, StepTwoFormYupSchema } from "@/lib/admin/uploadJob/StepFormSchema";

import StepTwoForm from "./StepsForms/StepTwoForm";
import StepThreeForm from "./StepsForms/StepThreeForm";
import PreviewForm from "./StepsForms/PreviewForm";
import { useApiCaller } from "@/hooks/useApicaller";
import { useCreateJobMutation } from "@/services/slices/adminSlice";
import { useJobFormStore } from "@/state/zustand/create-job-store";

import { useNavigate } from "react-router-dom";
import useToast from "@/hooks/use-toast";

const steps = [
    { title: "Basic Information ", description: "Job title, Company, Location" },
    { title: "Job Details", description: "Description, requirements, type" },
    { title: "Compensation", description: "Salary, benefits, Skill" },
    { title: "Preview", description: "Review and publish" },
]

const TITLES = ['Basic Information', 'Job Details', 'Compensation'];
const DESCRIPTION = ['Job title, Company, Location', 'Description, requirements, type', 'Salary, benefits, Skill'];

const CreateNewJob = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { showNotification } = useToast();
    const {
        formData,
        setStepOneData,
        setStepTwoData,
        setStepThreeData,
        resetForm
    } = useJobFormStore();
    const { executeApiCall, isLoading } = useApiCaller(useCreateJobMutation);
    const navigate = useNavigate();

    // Step One Form 
    const stepOneForm = useForm({
        resolver: yupResolver(StepOneFormYupSchema),
        defaultValues: formData.stepOne
    });

    // Step Two Form 
    const stepTwoForm = useForm({
        resolver: yupResolver(StepTwoFormYupSchema),
        defaultValues: formData.stepTwo
    });

    // Step Three Form
    const stepThreeForm = useForm({
        //@ts-ignore
        resolver: yupResolver(StepThreeFormYupSchema),
        defaultValues: formData.stepThree
    });

    const handleNext = async () => {
        let isValid = false;

        if (currentStep === 0) {
            isValid = await stepOneForm.trigger();
            if (isValid) {
                stepOneForm.handleSubmit((data) => {
                    setStepOneData(data);
                })();

                showNotification({
                    message: "Step 1 completed successfully!",
                    type: "success",
                });
            }
        }

        if (currentStep === 1) {
            isValid = await stepTwoForm.trigger();
            if (isValid) {
                stepTwoForm.handleSubmit((data) => {
                    setStepTwoData(data);
                })();
                showNotification({
                    message: "Step 2 completed successfully!",
                    type: "success",
                });
            }
        }

        if (currentStep === 2) {
            isValid = await stepThreeForm.trigger();
            if (isValid) {
                stepThreeForm.handleSubmit((data) => {
                    setStepThreeData(data);
                })();
                showNotification({
                    message: "Step 3 completed successfully!",
                    type: "success",
                });
            }
        }

        if (isValid && currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePublish = async () => {
        const date = formData.stepThree.last_application_date;
        let formattedDate = '';

        if (date) {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                formattedDate = `${year}-${month}-${day}`;
            }
        }

        const payload = {
            title: formData.stepOne.title,
            description: formData.stepOne.description,
            responsibilities: formData.stepTwo.responsibilities,
            requirements: formData.stepTwo.requirements,
            offered_benefits: formData.stepTwo.offered_benefits,
            is_salary_negotiable: formData.stepThree.is_salary_negotiable,
            project_duration: formData.stepThree.project_duration,
            job_type: formData.stepOne.job_type,
            work_type: formData.stepOne.work_type,
            location: formData.stepOne.location,
            specialization: formData.stepOne.specialization,
            role: formData.stepOne.role,
            skills: formData.stepThree.skills,
            experience_level: formData.stepThree.experience_level,
            experience_years: formData.stepThree.experience_years,
            number_of_positions: formData.stepThree.number_of_positions,
            salary_type: formData.stepThree.salary_type,
            salary_mode: formData.stepThree.salary_mode,
            salary_min: formData.stepThree.salary_min,
            salary_max: formData.stepThree.salary_max,
            salary_fixed: formData.stepThree.salary_fixed,
            last_application_date: formattedDate
        };

        try {
            await executeApiCall(payload);

            // Enhanced reset sequence
            resetForm(); // Reset Zustand store

            // Reset all form instances with empty values
            stepOneForm.reset({
                title: '',
                specialization: '',
                role: '',
                job_type: '',
                location: '',
                work_type: '',
                description: ''
            });

            stepTwoForm.reset({
                responsibilities: '',
                requirements: '',
                offered_benefits: ''
            });

            stepThreeForm.reset({
                salary_mode: '',
                salary_type: '',
                salary_min: '',
                salary_max: '',
                is_salary_negotiable: false,
                project_duration: '',
                skills: [],
                experience_level: '',
                experience_years: '',
                salary_fixed: '',
                number_of_positions: 1,
                last_application_date: ''
            });

            setCurrentStep(0);

            console.log("Job created successfully!");
            navigate("/admin/dashboard/allJobs");
        } catch (error) {
            console.error("Error creating job:", error);
        }
    };

    return (
        <div className="py-[44px] w-[calc(100svw-300px)]">
            <h3 className="text-[24px] font-semibold">Post a New Job</h3>
            <p className="text-[#575757] mb-[77px]">Create a amazing opportunity for talented professional.</p>
            <Stepper steps={steps} currentStep={currentStep} />

            {currentStep !== 3 && (
                <div className="my-[50px] rounded-md">
                    <h2 className="text-[24px] font-semibold mb-1">
                        Step {currentStep + 1} : {TITLES[currentStep]}
                    </h2>
                    <p className="text-[#575757] text-[16px]">{DESCRIPTION[currentStep]}</p>
                </div>
            )}

            {currentStep === 0 && <StepOneForm formMethods={stepOneForm} />}
            {currentStep === 1 && <StepTwoForm formMethods={stepTwoForm} />}
            {currentStep === 2 && <StepThreeForm formMethods={stepThreeForm} />}
            {currentStep === 3 && <PreviewForm />}

            <div className="flex justify-between max-w-[700px] items-center   mt-[50px]">
                <Button
                    className="text-[#000000] text-[16px] w-[150px] h-[53px]"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 0}
                >
                    <ChevronLeft size={16} className="mr-3" /> Previous
                </Button>

                {currentStep === steps.length - 1 ? (
                    <Button
                        className="bg-[#0481EF] text-white  text-[16px]  w-[150px] h-[53px] flex items-center justify-center gap-5"
                        onClick={handlePublish}
                        disabled={isLoading}
                    >
                        {isLoading ? "Publishing..." : "Publish"}
                    </Button>
                ) : (
                    <Button
                        className="bg-[#0481EF] text-white text-[16px]  w-[150px] h-[53px] flex items-center justify-center gap-5"
                        onClick={handleNext}
                    >
                        Next <ChevronRight size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CreateNewJob;