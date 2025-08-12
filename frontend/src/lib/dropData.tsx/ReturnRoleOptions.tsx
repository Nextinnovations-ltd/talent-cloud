import {  useGetSpecializationRoleOptionsQuery } from "@/services/slices/optionsSelectedSlice";
import { useMemo } from "react";

export const useFormattedRoleList = () => {
  const { data, isLoading } = useGetSpecializationRoleOptionsQuery();

  const formattedData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }, [data]);

  return { data: formattedData, isLoading };
};
