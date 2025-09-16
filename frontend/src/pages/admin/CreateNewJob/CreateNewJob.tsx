/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Stepper } from "@/components/ui/stepper";
import { useState, useEffect, useCallback } from "react";
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

import useToast from "@/hooks/use-toast";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { NavigationConfirmModal } from "@/components/common/NavigationConfirmModal";


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

    // Step One Form 
    const stepOneForm = useForm({
        resolver: yupResolver(StepOneFormYupSchema),
        defaultValues: formData.stepOne,
        mode: 'onSubmit'
    });

    // Step Two Form 
    const stepTwoForm = useForm({
        resolver: yupResolver(StepTwoFormYupSchema),
        defaultValues: formData.stepTwo,
        mode: 'onSubmit'
    });

    // Step Three Form
    const stepThreeForm = useForm({
        //@ts-ignore
        resolver: yupResolver(StepThreeFormYupSchema),
        defaultValues: formData.stepThree,
        mode: 'onSubmit'
    });

    // State to track if there are unsaved changes
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Function to check for unsaved changes
    const checkUnsavedChanges = useCallback(() => {
        const stepOneValues = stepOneForm.getValues();
        const stepTwoValues = stepTwoForm.getValues();
        const stepThreeValues = stepThreeForm.getValues();

        // Default values from the store
        const defaultStepOne = {
            title: '',
            specialization: '',
            role: '',
            job_type: '',
            location: '',
            work_type: '',
            description: ''
        };

        const defaultStepTwo = {
            responsibilities: '',
            requirements: '',
            offered_benefits: ''
        };

        const defaultStepThree = {
            salary_mode: '',
            salary_type: '',
            salary_min: '',
            salary_max: '',
            is_salary_negotiable: false,
            project_duration: '',
            skills: [],
            experience_level: '',
            experience_years: 1,
            salary_fixed: '',
            number_of_positions: 1,
            last_application_date: ''
        };

        // Check if current values differ from default values
        const hasStepOneData = JSON.stringify(stepOneValues) !== JSON.stringify(defaultStepOne);
        const hasStepTwoData = JSON.stringify(stepTwoValues) !== JSON.stringify(defaultStepTwo);
        const hasStepThreeData = JSON.stringify(stepThreeValues) !== JSON.stringify(defaultStepThree);

        const hasChanges = hasStepOneData || hasStepTwoData || hasStepThreeData;
        setHasUnsavedChanges(hasChanges);
        console.log('Form changes detected:', { 
            stepOneValues, 
            stepTwoValues, 
            stepThreeValues,
            hasStepOneData, 
            hasStepTwoData, 
            hasStepThreeData, 
            hasChanges 
        });
        return hasChanges;
    }, [stepOneForm, stepTwoForm, stepThreeForm]);

    // Initial check and update unsaved changes state when forms change
    useEffect(() => {
        checkUnsavedChanges();
    }, [checkUnsavedChanges]);

    // Initial check on mount
    useEffect(() => {
        // Small delay to ensure forms are fully initialized
        const timer = setTimeout(() => {
            checkUnsavedChanges();
        }, 100);
        return () => clearTimeout(timer);
    }, [checkUnsavedChanges]);

    // Add form change listeners
    useEffect(() => {
        const subscription1 = stepOneForm.watch(() => checkUnsavedChanges());
        const subscription2 = stepTwoForm.watch(() => checkUnsavedChanges());
        const subscription3 = stepThreeForm.watch(() => checkUnsavedChanges());

        return () => {
            subscription1.unsubscribe();
            subscription2.unsubscribe();
            subscription3.unsubscribe();
        };
    }, [checkUnsavedChanges, stepOneForm, stepTwoForm, stepThreeForm]);

    // Navigation guard
    const {
        showConfirmModal,
        confirmNavigation,
        cancelNavigation,
        navigateBypassingGuard
    } = useNavigationGuard({
        hasUnsavedChanges: hasUnsavedChanges,
        onConfirmNavigation: () => {
            showNotification({
                message: "Form data has been cleared",
                type: "success",
            });
            resetForm()
        }
    });

    // Reset forms when store data changes to ensure synchronization
    useEffect(() => {
        stepOneForm.reset(formData.stepOne);
    }, [formData.stepOne, stepOneForm]);

    useEffect(() => {
        stepTwoForm.reset(formData.stepTwo);
    }, [formData.stepTwo, stepTwoForm]);

    useEffect(() => {
        stepThreeForm.reset(formData.stepThree);
    }, [formData.stepThree, stepThreeForm]);

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
        // Validate all forms before publishing
        const isStepOneValid = await stepOneForm.trigger();
        const isStepTwoValid = await stepTwoForm.trigger();
        const isStepThreeValid = await stepThreeForm.trigger();

        if (!isStepOneValid || !isStepTwoValid || !isStepThreeValid) {
            // Redirect to the first step with errors
            if (!isStepOneValid) {
                setCurrentStep(0);
            } else if (!isStepTwoValid) {
                setCurrentStep(1);
            } else if (!isStepThreeValid) {
                setCurrentStep(2);
            }
            
            showNotification({
                message: "Please fix all validation errors before publishing",
                type: "danger",
            });
            return;
        }

        // Get the latest form data from all forms
        const stepOneData = stepOneForm.getValues();
        const stepTwoData = stepTwoForm.getValues();
        const stepThreeData = stepThreeForm.getValues();

        // Update the store with the latest form data
        setStepOneData(stepOneData);
        setStepTwoData(stepTwoData);
        setStepThreeData(stepThreeData);

        const date = stepThreeData.last_application_date;
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

       
        function sanitizeNumberPayload(value: string | undefined) {
            if (!value) return null;
            return Number(
              String(value).replace(/[^0-9.-]+/g, "") // remove $, commas, etc.
            );
          }
      
    
        const payload = {
            title: stepOneData.title,
            description: stepOneData.description,
            responsibilities: stepTwoData.responsibilities,
            requirements: stepTwoData.requirements,
            offered_benefits: stepTwoData.offered_benefits,
            is_salary_negotiable: stepThreeData.is_salary_negotiable,
            project_duration: stepThreeData.project_duration,
            job_type: stepOneData.job_type,
            work_type: stepOneData.work_type,
            location: stepOneData.location,
            specialization: stepOneData.specialization,
            role: stepOneData.role,
            skills: stepThreeData.skills,
            experience_level: stepThreeData.experience_level,
            experience_years: stepThreeData.experience_years,
            number_of_positions: stepThreeData.number_of_positions,
            salary_type: stepThreeData.salary_type,
            salary_mode: stepThreeData.salary_mode,
            salary_min: sanitizeNumberPayload(stepThreeData.salary_min),
            salary_max: sanitizeNumberPayload(stepThreeData.salary_max),
            salary_fixed: sanitizeNumberPayload(stepThreeData.salary_fixed),
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
                experience_years: 1,
                salary_fixed: '',
                number_of_positions: 1,
                last_application_date: ''
            });

            setCurrentStep(0);

            console.log("Job created successfully!");
            // Navigate once without showing the modal
            navigateBypassingGuard("/admin/dashboard/allJobs");
        } catch (error) {
            console.error("Error creating job:", error);
        }
    };

    return (
        <>
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

            {/* Navigation Confirmation Modal */}
            <NavigationConfirmModal
                isOpen={showConfirmModal}
                onConfirm={confirmNavigation}
                onCancel={cancelNavigation}
                title="Unsaved Changes"
                description="You have unsaved changes in your job posting form. Are you sure you want to leave? Your progress will be lost."
            />
        </>
    );
};

export default CreateNewJob;