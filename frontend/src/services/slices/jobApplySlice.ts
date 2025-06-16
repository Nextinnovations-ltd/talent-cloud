import apiSlice from "../api/apiSlice";

interface job  {
    id: number;
    title: string;
    description: string;
    location: string;
    experience_level: string;
    experience_years: string;
    job_type: string;
    work_type: string;
    company_name: string;
    skills:string[],
    display_salary: string;
    created_at: string;
    applicant_count: string;
}

interface JobApplyCardResponse {
    status: boolean;
    message: string;
    data: job[]
    
}

 interface JobDetailJobApplyCardResponse {
    id: number;
    title: string;
    description: string;
    responsibilities: string | null;
    requirements: string | null;
    offered_benefits: string | null;
    location: string;
    specialization: string;
    role: string | null;
    skills: string[];
    experience_level: string;
    experience_years: number | null;
    job_type: string;
    work_type: string;
    number_of_positions: number;
    salary_mode: string;
    salary_type: string;
    salary_min: string | null;
    salary_max: string | null;
    salary_fixed: string | null;
    is_salary_negotiable: boolean;
    project_duration: string;
    last_application_date: string | null;
    is_accepting_applications: boolean;
    view_count: number;
    applicant_count: number;
    bookmark_count: number;
    company: {
      id: number;
      name: string;
      description: string | null;
      image_url: string | null;
      industry: string | null;
      size: string | null;
      founded_date: string | null;
      is_verified: boolean;
    };
    job_poster_name: string | null;
  }
  
export const extendedJobApplySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobApplyCard: builder.query<JobApplyCardResponse, void>({
            query: () => '/job-posts/newest/',
        }),
        getDetailJobApplyCard: builder.query<JobDetailJobApplyCardResponse, number>({
            query:(id)=>`/job-posts/${id}/`
        })
    })
});

export const { useGetJobApplyCardQuery,useGetDetailJobApplyCardQuery } = extendedJobApplySlice;