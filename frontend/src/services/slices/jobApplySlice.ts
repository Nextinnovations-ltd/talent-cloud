import { Job } from "@/types/job-apply";
import apiSlice from "../api/apiSlice";

// Interfaces


interface JobApplyCardResponse {
  status: boolean;
  message: string;
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: Job[];
  };
}

interface JobDetailCard {
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
  is_applied: boolean;
  is_bookmarked:boolean;
}

interface JobDetailJobApplyCardResponse {
  status: boolean;
  message: string;
  data: JobDetailCard;
}

interface JobApplyCardParams {
  page?: number;
  job_type?: string;
  work_type?: string;
  project_duration?: string;
  salary_rate?: string;
  search?:string
}

interface BookmarkedJobResponse {
  status: boolean;
  message: string;
}

interface ApplyJobArg {
  jobId: number;
  credentials: Record<string, unknown>; // or a more specific type if known
}

// API Slice
export const extendedJobApplySlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobApplyCard: builder.query<JobApplyCardResponse, JobApplyCardParams>({
      query: (params) => ({
        url: '/job-posts/search/',
        params: {
          page: params.page,
          job_type: params.job_type,
          work_type: params.work_type,
          project_duration: params.project_duration,
          salary_rate: params.salary_rate,
          ordering: '-created_at',
          search:params.search
        },
      }),
      providesTags: ['JobList'],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    getDetailJobApplyCard: builder.query<JobDetailJobApplyCardResponse, number>({
    query: (id) => `/job-posts/${id}/`,
      providesTags: ['JobList'],
      keepUnusedDataFor: 0,
      refetchOnMountOrArgChange: true,
    }),

    bookMarkedJob: builder.mutation<BookmarkedJobResponse, number>({
      query: (jobId) => ({
        url: `/job-posts/${jobId}/bookmark/`,
        method: "POST",
      }),
      invalidatesTags: ['JobList'],
    }),

    deleteBookMarkedJob: builder.mutation<BookmarkedJobResponse, number>({
      query: (jobId) => ({
        url: `/my-bookmarks/${jobId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ['JobList'],
    }),

    applyJob: builder.mutation<unknown, ApplyJobArg>({
      query: ({ jobId, credentials }) => ({
        url: `/job-posts/${jobId}/applications/`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ['JobList'],
    }),
  }),
});

// Export hooks
export const {
  useGetJobApplyCardQuery,
  useGetDetailJobApplyCardQuery,
  useBookMarkedJobMutation,
  useApplyJobMutation,
  useDeleteBookMarkedJobMutation,
} = extendedJobApplySlice;
