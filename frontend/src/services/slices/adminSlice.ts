import { JobPostResponse, RelatedInfoResponse } from "@/types/admin-auth-slice";
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
        getOrganizationDetailByAdmin:builder.query<RelatedInfoResponse,void>({
            query:()=> '/related-company-info/'
        }),
        getNIAllJobsByAdmin:builder.query<JobPostResponse,number>({
            query:(id)=> `/dashboard/ni/job-posts/all/?page=${id}`
        }),
        getAllApplicants:builder.query<unknown,unknown>({
            query:(id)=>`/job-posts/${id}/applications/`
        })
    
    })
});

export const { useCreateJobMutation,useGetOrganizationDetailByAdminQuery,useGetNIAllJobsByAdminQuery,useGetAllApplicantsQuery } = extendedAdminSlice