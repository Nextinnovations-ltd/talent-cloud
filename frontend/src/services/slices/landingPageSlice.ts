
import { RecentJobCardResponse } from "@/types/landingpage-slice";
import apiSlice from "../api/apiSlice";

export const extendedLandingPageSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecentJobLists: builder.query<RecentJobCardResponse, void>({
      query: () => `/job-posts/recent/`,
    }),
  }),
});

export const { useGetRecentJobListsQuery } = extendedLandingPageSlice;
  