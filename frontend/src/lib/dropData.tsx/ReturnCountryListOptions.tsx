import { useMemo } from "react";
import { useGetCountryListsOptionsQuery } from "@/services/slices/optionsSelectedSlice";

export const useFormattedCountryList = () => {
  const { data, isLoading } = useGetCountryListsOptionsQuery();

  const formattedData = useMemo(() => {
    if (!data?.data) return []; 

    return data.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }, [data]);

  return { data: formattedData, isLoading };
};
