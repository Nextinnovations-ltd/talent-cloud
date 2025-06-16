import apiSlice from "../api/apiSlice";

interface JobApplyCardResponse {
    id: number;
    title: string;
    description: string;
    location: string;
    experience_level: string;
    experience_years: string;
    job_type: string;
    work_type: string;
    company_name: string;
    display_salary: string;
    created_at: string;
    applicant_count: string;
}

export const extendedJobApplySlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobApplyCard: builder.query<JobApplyCardResponse[], void>({
            query: () => '/job-posts/newest/',
        })
    })
});

export const { useGetJobApplyCardQuery } = extendedJobApplySlice;