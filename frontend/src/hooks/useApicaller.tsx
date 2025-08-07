/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import useToast from "./use-toast";

export const useApiCaller = (apiMutation: any) => {
  const [callApi, { isLoading, isError }] = apiMutation();
  const { showNotification } = useToast();

  const executeApiCall = useCallback(
    async (payload: Record<string, any>) => {
      try {
        const response = await callApi(payload);

        const message =
          response?.message || response?.data?.message || response?.error?.data.message|| "Operation completed";

        const status = response?.data?.status || response?.error?.data.status;


        if (response?.status || response?.data?.status) {
          showNotification({
            message,
            type: "success",
          });
        } else {
          showNotification({
            message,
            type: "danger",
          });
        }

        return { success: status, data: response };
      } catch (error: any) {
        const message =
          error?.data?.message || error?.message || "Something went wrong";

        console.error("API Call Error:", error);

        showNotification({
          message,
          type: "danger",
        });

        return { success: false, error: error?.data || error };
      }
    },
    [callApi, showNotification]
  );

  return { executeApiCall, isLoading, isError };
};
