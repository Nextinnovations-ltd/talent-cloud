import { useEffect, useMemo } from "react";
import { useGetUserSpecializationQuery } from "@/services/slices/onBoardingSlice";

export const useFormattedSpecialization = () => {
  const { data, isLoading } = useGetUserSpecializationQuery();

  const formattedData = useMemo(() => {
    if (!data?.data) return []; // Ensure data exists before accessing .data

    return data.data.map((item: { id: number; name: string }) => ({
      value: item.id.toString(),
      label: item.name, // Fixed: Correctly access name from item
    }));
  }, [data]);

  useEffect(() => {
    console.log("Data Fetching Status:", isLoading);
    console.log("Fetched Data:", data);
  }, [isLoading, data]);

  return { data: formattedData, isLoading };
};
