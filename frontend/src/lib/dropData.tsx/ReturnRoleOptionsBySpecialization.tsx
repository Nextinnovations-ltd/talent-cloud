import {  useGetRolesBySpecializationsOptionsQuery } from "@/services/slices/optionsSelectedSlice";
import { useMemo } from "react";

export const useFormattedRolesBySpecializationList = (specializationId: number | string) => {
  const { data, isLoading,isSuccess } = useGetRolesBySpecializationsOptionsQuery({ id: specializationId },{skip:!specializationId});


  const formattedData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((item: { id: number; name: string }) => ({
      value: item.id,
      label: item.name,
    }));
  }, [data]);

  return { data: formattedData, isLoading,isSuccess };
};
