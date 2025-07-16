import {  CityListsOptionsResponse, CountryListOptionsResponse, ExperiencesOptionsResponse, RolesListsOptionsResopnse, SkillListsOptionsResponse, SpecializationsListsOptionsResponse } from "@/types/options-selected-sice-types";
import apiSlice from "../api/apiSlice";


export const extendedSelectedOptionsSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getCountryListsOptions: builder.query<CountryListOptionsResponse,void>({
            query:()=>"/location/country-list/"
        }),
        getCityListsOptions:builder.query<CityListsOptionsResponse,{id:number | string}>({
            query:(id)=> `/location/city-list/${id.id}/`
        }),
        getSpecializationsOptions:builder.query<SpecializationsListsOptionsResponse,void>({
            query:()=>"/specializations/"
        }),
        getSpecializationRoleOptions:builder.query<RolesListsOptionsResopnse,void>({
            query:()=>"/roles/"
        }),
        getRolesBySpecializationsOptions:builder.query<RolesListsOptionsResopnse,{id:number | string}>({
            query:(id)=>`/roles/by-specialization/${id?.id}/`
        }),
        getSkillsOptions: builder.query<SkillListsOptionsResponse,void>({
            query:()=>"/skills/"
        }),
        getExperienceOptions:builder.query<ExperiencesOptionsResponse,void>({
            query:()=>'/experience-levels/'
        })
    })
});


export const {
    useGetCountryListsOptionsQuery,
    useGetCityListsOptionsQuery,
    useGetSpecializationsOptionsQuery,
    useGetSpecializationRoleOptionsQuery,
    useGetRolesBySpecializationsOptionsQuery,
    useGetSkillsOptionsQuery
}  = extendedSelectedOptionsSlice;