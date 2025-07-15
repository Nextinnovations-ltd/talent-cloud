import {  CityListsOptionsResponse, CountryListOptionsResponse, RolesListsOptionsResopnse, SpecializationsListsOptionsResponse } from "@/types/options-selected-sice-types";
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
        })
    })
});


export const {
    useGetCountryListsOptionsQuery,
    useGetCityListsOptionsQuery,
    useGetSpecializationsOptionsQuery,
    useGetSpecializationRoleOptionsQuery,
    useGetRolesBySpecializationsOptionsQuery
}  = extendedSelectedOptionsSlice;