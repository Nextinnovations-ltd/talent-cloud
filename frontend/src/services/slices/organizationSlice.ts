import { Company } from "@/types/organization";
import apiSlice from "../api/apiSlice";



//API SLICE
export const extendedOrganizationSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getOrganizationDetail:builder.query<Company,string>({
            query:(slug)=>`/company/${slug}/`
        })
    })
});

export const {
    useGetOrganizationDetailQuery
} = extendedOrganizationSlice;