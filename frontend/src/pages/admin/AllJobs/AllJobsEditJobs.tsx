import JobCandidatesInfoHeader from "@/components/common/Admin/JobCandidatesInfoHeader";
import { StepOneFormYupSchema } from "@/lib/admin/uploadJob/StepFormSchema";
import { useGetJobDetailOfEditQuery } from "@/services/slices/adminSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import StepOneForm from "../CreateNewJob/StepsForms/StepOneForm";
import { JobPostDetails } from "@/types/admin-auth-slice";

const AllJobsEditJobs = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetJobDetailOfEditQuery(id ?? '', {
    skip: !id,
  });

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
    }
  }, [JobData, isLoading, stepOneForm]);

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
      <StepOneForm formMethods={stepOneForm} />
    </div>
  );
};

export default AllJobsEditJobs;