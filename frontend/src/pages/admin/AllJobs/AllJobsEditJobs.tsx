/* eslint-disable react-hooks/exhaustive-deps */
import JobCandidatesInfoHeader from "@/components/common/Admin/JobCandidatesInfoHeader";
import { StepOneFormYupSchema, StepThreeFormYupSchema, StepTwoFormYupSchema } from "@/lib/admin/uploadJob/StepFormSchema";
import { useGetJobDetailOfEditQuery, useUpdateJobMutation } from "@/services/slices/adminSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBlocker, useParams } from "react-router-dom";
import StepOneForm from "../CreateNewJob/StepsForms/StepOneForm";
import { JobPostDetails } from "@/types/admin-auth-slice";
import StepTwoForm from "../CreateNewJob/StepsForms/StepTwoForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useJobFormStore } from "@/state/zustand/create-job-store";
import StepThreeForm from "../CreateNewJob/StepsForms/StepThreeForm";
import PreviewForm from "../CreateNewJob/StepsForms/PreviewForm";
import useToast from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const steps = [
  { title: "Basic Information ", description: "Job title, Company, Location" },
  { title: "Job Details", description: "Description, requirements, type" },
  { title: "Compensation", description: "Salary, benefits, Skill" },
  { title: "Preview", description: "Review and publish" },
]

const AllJobsEditJobs = () => {
  const { id } = useParams<{ id: string }>();
  const { showNotification } = useToast();
  const navigation = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const {
    formData, 
    setStepOneData,
  setStepTwoData,
    setStepThreeData,
    resetForm
  } = useJobFormStore();

  const [updateJob] = useUpdateJobMutation();



  const { data, isLoading, error } = useGetJobDetailOfEditQuery(id ?? '', {
    skip: !id,
  });


  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return currentLocation.pathname !== nextLocation.pathname;
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      resetForm();
      blocker.proceed(); // Continue with navigation after reset
    }
  }, [blocker, resetForm]);

  const JobData: JobPostDetails | undefined = data?.data;

  const stepOneForm = useForm({
    resolver: yupResolver(StepOneFormYupSchema),
    defaultValues: {
      title: "",
      specialization: "",
      role: "",
      job_type: "",
      location: "",
      work_type: "",
      description: "",
    },
  });

  const stepTwoForm = useForm({
    resolver: yupResolver(StepTwoFormYupSchema),
    defaultValues: {
      requirements: "",
      responsibilities: "",
      offered_benefits: ""
    }
  });

  const stepThreeForm = useForm({
    resolver: yupResolver(StepThreeFormYupSchema),
    defaultValues: {
      salary_mode: "",
      salary_type: "",
      salary_min: "",
      salary_max: "",
      is_salary_negotiable: false,
      project_duration: "",
      skills: [],
      experience_level: "",
      experience_years: "",
      salary_fixed: "",
      number_of_positions: 0,
      last_application_date: ""
    }
  })

  useEffect(() => {
    if (JobData && !isLoading) {
      stepOneForm.reset({
        title: JobData.title,
        specialization: JobData.specialization,
        role: JobData.role,
        job_type: JobData.job_type,
        location: JobData.location,
        work_type: JobData.work_type,
        description: JobData.description,
      });

      stepTwoForm.reset({
        requirements: JobData?.requirements,
        responsibilities: JobData?.responsibilities,
        offered_benefits: JobData?.offered_benefits
      });

      stepThreeForm.reset({
        salary_mode: JobData?.salary_mode,
        salary_type: JobData?.salary_type,
        salary_min: JobData?.salary_min || '',
        salary_max: JobData?.salary_max || '',
        is_salary_negotiable: JobData?.is_salary_negotiable,
        project_duration: JobData?.project_duration,
        skills: JobData?.skills,
        experience_level: JobData?.experience_level,
        experience_years: JobData?.experience_years,
        salary_fixed: JobData?.salary_fixed || "",
        number_of_positions: JobData?.number_of_positions,
        last_application_date: JobData?.last_application_date
      })
    }
  }, [JobData, isLoading, stepOneForm, stepTwoForm]);


  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 0) {
      isValid = await stepOneForm.trigger();
      if (isValid) {
        stepOneForm.handleSubmit((data) => {
          setStepOneData(data);
        })();
      }
    }

    if (currentStep === 1) {
      isValid = await stepTwoForm.trigger();
      if (isValid) {
        stepTwoForm.handleSubmit((data) => {
          setStepTwoData(data);
        })();
      }
    }

    if (currentStep === 2) {
      isValid = await stepThreeForm.trigger();
      if (isValid) {
        stepThreeForm.handleSubmit((data) => {
          setStepThreeData(data);
        })();
      }
    }


    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePublish =  async () => {
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

    const response =   await updateJob({id:id || '',credentials:payload})

    showNotification({
      message:response.data?.message,
      type: "success",
    });


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
           number_of_positions: 0,
           last_application_date: ''
       });
       
       setCurrentStep(0);
       console.log("Job created successfully!");
       navigation('/admin/dashboard/allJobs');

    } catch (error){
      console.error("Error creating job",error)
    }
    

  };


  if (!id) {
    return <div className="mt-10 text-center text-gray-500">Invalid job ID</div>;
  }

  if (isLoading) {
    return (
      <div className="mt-10 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-center text-red-500">
        Failed to load job details
      </div>
    );
  }

  return (
    <div className="mt-3">
      <JobCandidatesInfoHeader id={id} side="preview" />
      

     <div className="ml-10">
     {currentStep === 0 && <StepOneForm formMethods={stepOneForm} />}
      {currentStep === 1 && <StepTwoForm formMethods={stepTwoForm} />}
      {currentStep === 2 && <StepThreeForm formMethods={stepThreeForm} />}
      {currentStep === 3 && <PreviewForm />}

      <div className="flex  justify-between max-w-[700px]  mt-[50px]">
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
            className="bg-[#0481EF] text-[16px] text-white w-[150px] h-[53px]"
            onClick={handlePublish}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </Button>
        ) : (
          <Button
            className="bg-[#0481EF] text-[16px] text-white w-[150px] h-[53px] flex items-center justify-center gap-2"
            onClick={handleNext}
          >
            Next <ChevronRight size={16} />
          </Button>
        )}
      </div>
     </div>
      </div>




  );
};

export default AllJobsEditJobs;