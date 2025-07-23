import { LoginCredentials } from "@/types/admin-auth-slice";
import apiSlice from "../api/apiSlice";


export const extendedAdminAuthSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation<unknown, LoginCredentials>({
            query: (credentials) => ({
                url: "/auth/admin/login/",
                method: "POST",
                body: JSON.stringify(credentials),
            }),
        })
    })
})

export const { useAdminLoginMutation } = extendedAdminAuthSlice;