import { ApplicantsApiResponse, EditJobDetailResponse, JobPostResponse, JobSeekerCountResponse, RecentJobPost, RelatedInfoResponse, ShortListMutationResopnse } from "@/types/admin-auth-slice";
import apiSlice from "../api/apiSlice";

export const extendedAdminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createJob: builder.mutation<unknown, unknown>({
            query: (credentials) => ({
                url: '/job-posts/',
                method: "POST",
                body: JSON.stringify(credentials)
            })
        }),
        updateJob: builder.mutation<EditJobDetailResponse, { id: string; credentials: unknown }>({
            query: ({ id, credentials }) => ({
                url: `/job-posts/${id}/`,
                method: 'PATCH',
                body: JSON.stringify(credentials)
            }),
        }),
        deleteJob: builder.mutation<unknown, number | string>({
            query: (id) => ({
                url: `/job-posts/${id}/`,
                method: "DELETE"
            })
        }),
        getJobDetailOfEdit: builder.query<EditJobDetailResponse, unknown>({
            query: (id) => `/job-posts/edit/${id}/`
        }),
        getOrganizationDetailByAdmin: builder.query<RelatedInfoResponse, void>({
            query: () => '/related-company-info/'
        }),
        getNIAllJobsByAdmin: builder.query<JobPostResponse, { page: string | number, ordering?: string }>({
            query: (data) => `/dashboard/ni/job-posts/all/?page=${data?.page}&ordering=${data?.ordering}`
        }),
        getAllApplicants: builder.query<unknown, unknown>({
            query: (id) => `/job-posts/${id}/applications/`
        }),
        getAllJobsApplicants: builder.query<ApplicantsApiResponse, { page: string | number, id: string | number, ordering?: string }>({
            query: (data) =>
                `/dashboard/ni/job-posts/${data?.id}/applicants/?page=${data?.page}&ordering=${data?.ordering}`,
        }),
        getAllShortListApplicants: builder.query<ApplicantsApiResponse, { id: string | number, ordering?: string, page: string | number, }>({
            query: (data) => `/dashboard/ni/job-posts/${data.id}/applicants/shortlisted?page=${data?.page}&ordering=${data?.ordering}`,
            providesTags: ['NotificationList']
        }),
        getAllRecentJobsList: builder.query<RecentJobPost, void>({
            query: () => `/dashboard/ni/job-posts/recent/`
        }),
        getAllRecentApplicantsList: builder.query<ApplicantsApiResponse, void>({
            query: () => `/dashboard/ni/applicants/recent/`
        }),
        getDashboardAnalytics: builder.query<JobSeekerCountResponse, void>({
            query: () => `/dashboard/ni/statistics`
        }),

        //short list
        shortListApplicants: builder.mutation<ShortListMutationResopnse, { jobId: string | number; applicantId: string | number }>({
            query: ({ jobId, applicantId }) => ({
                url: `/dashboard/ni/job-posts/${jobId}/applicants/${applicantId}/shortlist/`,
                method: "POST", // or PATCH depending on backend
            }),
            invalidatesTags: ['NotificationList']
        }),
    })
});

export const { useCreateJobMutation, useGetOrganizationDetailByAdminQuery, useGetNIAllJobsByAdminQuery, useGetAllApplicantsQuery, useGetAllJobsApplicantsQuery, useGetAllRecentApplicantsListQuery, useGetAllRecentJobsListQuery, useGetDashboardAnalyticsQuery, useGetJobDetailOfEditQuery, useShortListApplicantsMutation, useGetAllShortListApplicantsQuery, useUpdateJobMutation, useDeleteJobMutation } = extendedAdminSlice