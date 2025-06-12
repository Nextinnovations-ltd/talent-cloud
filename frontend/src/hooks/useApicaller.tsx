import { useCallback } from "react";
import useToast from "./use-toast";

export const useApiCaller = (apiMutation: any) => {
  const [callApi, { isLoading, isError }] = apiMutation();
  const { showNotification } = useToast();

  const executeApiCall = useCallback(
    async (payload: Record<string, any>) => {
      try {
        const response = await callApi(payload).unwrap();
        showNotification({
          message: response?.message,
          type: "success",
        });


        return { success: true, data: response };
      } catch (error: any) {
        console.error("API Call Error:", error);
        showNotification({
          message: error?.data?.message,
          type: "danger",
        });
        return { success: false, error: error?.data || error };
      }
    },
    [callApi]
  );

  return { executeApiCall, isLoading, isError };
};
