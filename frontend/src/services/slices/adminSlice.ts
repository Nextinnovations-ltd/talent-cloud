/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApplicantsApiResponse, EditJobDetailResponse, JobPostResponse, JobSeekerCandidatesResponse, JobSeekerCertificationDetail, JobSeekerCountResponse, JobSeekerDetailExperience, JobSeekerDetailVideoResponse, JobSeekerEducationDetail, JobSeekerOverviewResponse, JobSeekerProjectListResponse, RecentJobPost, RelatedInfoResponse, ResumeListResponse, ResumeTypeItem, ShortListMutationResopnse } from "@/types/admin-auth-slice";
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
            invalidatesTags: ['JobPostEdit']
        }),
        deleteJob: builder.mutation<unknown, number | string>({
            query: (id) => ({
                url: `/job-posts/${id}/`,
                method: "DELETE"
            })
        }),
        getJobDetailOfEdit: builder.query<EditJobDetailResponse, unknown>({
            query: (id) => `/job-posts/edit/${id}/`,
            providesTags: ['JobPostEdit']
        }),
        getOrganizationDetailByAdmin: builder.query<RelatedInfoResponse, void>({
            query: () => '/related-company-info/'
        }),
        getNIAllJobsByAdmin: builder.query<JobPostResponse, { page: string | number, ordering?: string }>({
            query: (data) => `/dashboard/ni/job-posts/all/?page=${data?.page}&ordering=${data?.ordering}`
        }),
        getNIExpiredJobsByAdmin: builder.query<JobPostResponse, { page: string | number, ordering?: string }>({
            query: (data) => `/dashboard/ni/job-posts/expired/?page=${data?.page}&ordering=${data?.ordering}`
        }),
        getNIActivedJobsByAdmin: builder.query<JobPostResponse, { page: string | number, ordering?: string }>({
            query: (data) => `/dashboard/ni/job-posts/active/?page=${data?.page}&ordering=${data?.ordering}`
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
        getDashboardRoleAnalytics: builder.query<unknown, void>({
            query: () => `dashboard/ni/statistics/role/`
        }),

        //short list
        shortListApplicants: builder.mutation<ShortListMutationResopnse, { jobId: string | number; applicantId: string | number }>({
            query: ({ jobId, applicantId }) => ({
                url: `/dashboard/ni/job-posts/${jobId}/applicants/${applicantId}/shortlist/`,
                method: "POST", // or PATCH depending on backend
            }),
            invalidatesTags: ['NotificationList']
        }),
        //candidates
        getJobSeekersOverView: builder.query<JobSeekerOverviewResponse, { id: string | number, applicationId: string | number }>({
            query: ({ id, applicationId }) => `/dashboard/ni/job-seekers/${id}/overview?application_id=${applicationId}`
        }),
        getJobSeekersProjects: builder.query<JobSeekerProjectListResponse, { id: string | number }>({
            query: ({ id }) => `/dashboard/ni/job-seekers/${id}/projects/`
        }),
        getJobSeekerDetailVideo: builder.query<JobSeekerDetailVideoResponse, { id: string | number }>({
            query: ({ id }) => `/dashboard/ni/job-seekers/${id}/video/`
        }),
        getJobSeekerDetailExperience: builder.query<JobSeekerDetailExperience, { id: string | number }>({
            query: ({ id }) => `/dashboard/ni/job-seekers/${id}/experiences/`
        }),
        getJobSeekerDetailEducation: builder.query<JobSeekerEducationDetail, { id: string | number }>({
            query: ({ id }) => `/dashboard/ni/job-seekers/${id}/educations/`
        }),
        getJobSeekerDetailCertification: builder.query<JobSeekerCertificationDetail, { id: string | number }>({
            query: ({ id }) => `/dashboard/ni/job-seekers/${id}/certifications/`
        }),
        getJobSeekerCandidates: builder.query<JobSeekerCandidatesResponse, { page: string | number, ordering?: string, search?: string }>({
            query: (data) => `/dashboard/ni/job-seekers/all/?search=${data?.search}&page=${data?.page}&ordering=${data?.ordering}`
        }),
        getJobSeekerCandidateFavourites: builder.mutation<unknown, { id: string }>({
            query: (data) => ({
                url: `/dashboard/ni/job-seekers/${data?.id}/favourite/`,
                method: "POST"
            }),
            invalidatesTags: ['CandidateFavList']
        }),
        getJobSeekerCandidatesFavourite: builder.query<JobSeekerCandidatesResponse, { page: string | number, ordering?: string, search?: string }>({
            query: (data) => `/dashboard/ni/job-seekers/favourites/?search=${data?.search}&ordering=${data?.ordering}&page=${data?.page}`,
            providesTags: ['CandidateFavList']
        }),
        getJobSeekerResumeList: builder.query<ResumeListResponse, void>({
            query: () => `/jobseeker/profile/resumes/list/`
        }),
        defaultJobSeekerResume: builder.mutation<ResumeTypeItem, { id: string | number }>({
            query: (data) =>({
               url:  `/jobseeker/profile/resumes/${data?.id}/set-default/`,
               method:"POST"
            })
        })
    })
});



export const { useCreateJobMutation, useGetOrganizationDetailByAdminQuery, useGetNIAllJobsByAdminQuery, useGetAllApplicantsQuery, useGetAllJobsApplicantsQuery, useGetAllRecentApplicantsListQuery, useGetAllRecentJobsListQuery, useGetDashboardAnalyticsQuery, useGetJobDetailOfEditQuery, useShortListApplicantsMutation, useGetAllShortListApplicantsQuery, useUpdateJobMutation, useDeleteJobMutation, useGetNIActivedJobsByAdminQuery, useGetNIExpiredJobsByAdminQuery, useGetJobSeekersOverViewQuery, useGetJobSeekersProjectsQuery, useGetJobSeekerDetailVideoQuery, useGetJobSeekerDetailExperienceQuery, useGetJobSeekerDetailEducationQuery, useGetJobSeekerDetailCertificationQuery, useGetDashboardRoleAnalyticsQuery, useGetJobSeekerCandidatesQuery, useGetJobSeekerCandidateFavouritesMutation, useGetJobSeekerCandidatesFavouriteQuery, useGetJobSeekerResumeListQuery,useDefaultJobSeekerResumeMutation } = extendedAdminSlice