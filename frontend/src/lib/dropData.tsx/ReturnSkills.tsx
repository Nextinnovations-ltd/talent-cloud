import {  useGetJobSeekerUserSkillsQuery } from '@/services/slices/jobSeekerSlice'
import { useGetSkillsOptionsQuery } from '@/services/slices/optionsSelectedSlice';
import { useMemo } from 'react'

export const useFormattedSkills = () => {

    const { data: skillsData, isLoading,refetch } = useGetSkillsOptionsQuery();

    const formattedData = useMemo(() => {
        if (!skillsData?.data) return [];

        return skillsData?.data?.map((item: { id: number; title: string }) => ({
            value: item?.id,
            label: item?.title
        }))
    }, [skillsData]);

    return { data: formattedData, isLoading,refetch }
}


export const useFormattedUserSkills = () => {
    const { data: skillsData, isLoading,refetch } = useGetJobSeekerUserSkillsQuery();

    const formattedData = useMemo(() => {
        if (!skillsData?.data) return [];

        return skillsData.data.map((item: { id: number; title: string }) => item.id);
    }, [skillsData]);

    return { data: formattedData, isLoading,refetch };
};