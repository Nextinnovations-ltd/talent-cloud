/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { URL } from "./apiurls";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";


const baseQuery = fetchBaseQuery({
  baseUrl: URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    // Handle Content-Type
    if (headers.has("Content-Type")) {
      const contentType = headers.get("Content-Type");
      if (contentType === "multipart/form-data") {
        headers.delete("Content-Type");
      } else {
        console.debug("Content-Type header is not multipart:", contentType);
      }
    } else {
      headers.set("Content-Type", "application/json");
    }

    // Handle Authorization
    const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (
    result?.error?.status === 403 &&
    (result.error?.data as { message?: string })?.message === "Unauthenticated"
  ) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token/", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.data && (refreshResult.data as { status?: boolean }).status) {
      const { setReauthToken } = await import("../slices/authSlice");
      const newToken = (refreshResult.data as { data: { token: string } }).data.token;
      api.dispatch(setReauthToken(newToken));

      result = await baseQuery(args, api, extraOptions);
    } else {

      const { revertAll } = await import("../slices/authSlice");
      api.dispatch(revertAll());
      removeTokensFromLocalStorage();
      removeTokenFromSessionStorage();
      window.location.replace("/auth/login");
    }
  }

  return result;
};


const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "JobList",
    "CertificationList",
    "EducationsList",
    "selectprojectsList",
    "videoIntroductionList",
    "appliedJobs",
    "bookmarked",
    "NotificationList",
    "ShortList",
    "JobPostEdit",
  ],
  endpoints: () => ({}),
});

export default apiSlice;


// const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object = {}) => {
//   const result = await baseQuery(args, api, extraOptions);

//   const status = (result.error as FetchBaseQueryError)?.status;

//   // Detailed logging for debugging

//   if (status === 401 || status === 403 || status === 500) {
//     removeTokenFromSessionStorage();
//     removeTokensFromLocalStorage();
//     window.location.href = "/emp/lp";
//   }

//   return result;
// };
