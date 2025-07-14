import { CityListResponse, CountryListResponse } from "@/types/options-selected-sice-types";
import apiSlice from "../api/apiSlice";



export const extendedSelectedOptionsSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getCountryListsOptions: builder.query<CountryListResponse,void>({
            query:()=>"/location/country-list/"
        }),
        getCityListsOptions:builder.query<CityListResponse,{id:number | string}>({
            query:(id)=> `/location/city-list/${id.id}/`
        })
    })
});


export const {
    useGetCountryListsOptionsQuery,
    useGetCityListsOptionsQuery,
}  = extendedSelectedOptionsSlice;