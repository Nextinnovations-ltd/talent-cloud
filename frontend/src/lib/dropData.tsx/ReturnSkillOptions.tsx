/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useMemo } from "react";

import { useGetJobSeekerSkillsOptionsQuery } from "@/services/slices/jobSeekerSlice";

export const useFormattedSkillsOpions = () => {
  const { data, isLoading } = useGetJobSeekerSkillsOptionsQuery();

  const formattedData = useMemo(() => {
    if (!data?.data) return []; // Ensure data exists before accessing .data

     //@ts-ignore
    return data.data?.map((item: { id: number; name: string }) => ({
      value: item.id.toString(),
       //@ts-ignore
      label: item.title, // Fixed: Correctly access name from item
    }));
  }, [data]);

  useEffect(() => {
    console.log("Data Fetching Status:", isLoading);
    console.log("Fetched Data:", data);
  }, [isLoading, data]);

  return { data: formattedData, isLoading };
};
