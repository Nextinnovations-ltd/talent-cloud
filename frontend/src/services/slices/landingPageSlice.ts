import apiSlice from "../api/apiSlice";

export const extendedLandingPageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecentJobLists: builder.query<unknown, void>({
      query: () => `/job-posts/recent/`,
    }),
  }),
});

export const { useGetRecentJobListsQuery } = extendedLandingPageSlice;
