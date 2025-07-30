import { useGetCityListsOptionsQuery } from "@/services/slices/optionsSelectedSlice";
import { useMemo } from "react";

export const useFormattedCityList = (countryId: number | string) => {
  const { data, isLoading } = useGetCityListsOptionsQuery({ id: countryId });

  const formattedData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }, [data]);

  return { data: formattedData, isLoading };
};
