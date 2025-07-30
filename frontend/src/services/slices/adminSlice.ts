import apiSlice from "../api/apiSlice";





export const extendedAdminSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createJob: builder.mutation<unknown, unknown>({
            query: (credentials) => ({
                url: '/job-posts/',
                method: "POST",
                body: JSON.stringify(credentials)
            })
        })
    })
});

export const { useCreateJobMutation } = extendedAdminSlice