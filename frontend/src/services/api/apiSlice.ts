import { createApi, fetchBaseQuery, FetchBaseQueryError, FetchArgs, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { LocalUrl } from "./apiurls";
import {
  removeTokenFromSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";
import { toast } from "sonner";

interface RootState {
  auth: {
    token: string | null;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: LocalUrl,
  credentials: "include",
  prepareHeaders: (headers, api) => {
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

    const state = api.getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: unknown) => {
  const result = await baseQuery(args, api, extraOptions);

  if ((result.error as FetchBaseQueryError)?.status === 401) {
    // Handle unauthorized error
    removeTokenFromSessionStorage();
    removeTokensFromLocalStorage();
    toast.error("Session expired. Please login again.");
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
