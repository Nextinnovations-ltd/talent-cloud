import { useMemo } from "react";
import { useGetProfessionalsQuery } from "@/services/slices/onBoardingSlice";

export const useFormattedExperience = () => {
  const { data, isLoading } = useGetProfessionalsQuery();

  const formattedData = useMemo(() => {
    if (!data?.data) return []; 

    return data.data.map((item: { id: number; level: string }) => ({
      value: item.id.toString(),
      label: item.level,
    }));
  }, [data]);

  return { data: formattedData, isLoading };
};
