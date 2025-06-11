import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LocalUrl } from "./apiurls";
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";
import { revertAll, setReauthToken } from "../slices/authSlice";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: LocalUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }: { getState: any }) => {
    if (headers.has("Content-Type")) {
      const contentType = headers.get("Content-Type");

      if (contentType === "multipart/form-data") {
        headers.delete("Content-Type");
      } else {
        console.log("Content-Type header is not multipart:", contentType);
      }
    } else if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = getState().auth.token;

    console.log(token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  const result: any = await baseQuery(args, api, extraOptions);

  if (
    result?.error?.data?.message === "Unauthenticated" &&
    result?.error?.status === 403
  ) {
    const refreshResult: any = await baseQuery(
      {
        url: "/auth/refresh-token/",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data?.status) {
      // If token refresh is successful, update the token and retry the original request
      api.dispatch(setReauthToken(refreshResult.data.data.token));
      return await baseQuery(args, api, extraOptions);
    } else if (!refreshResult.data?.status) {
      // If token refresh fails, handle the error and redirect to the login page
      console.log("Token expired:", refreshResult);
    
      // Display an error message to the user
      toast.error(refreshResult.error?.data?.message || "Session expired. Please log in again.", {
        style: { background: "#ff7979", color: "#ffffff" },
        className: "text-[12px]",
      });
    
      // Redirect to the login page
      window.location.href = '/auth/login'; // or window.location.replace('/auth/login')
    
      // Clear state and storage
      api.dispatch(revertAll());
      removeTokensFromLocalStorage();
      removeTokenFromSessionStorage();
    }
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: () => ({}),
});

export default apiSlice;
