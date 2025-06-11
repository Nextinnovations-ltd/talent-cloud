import { AuthActions, AuthState } from "@/types/auth-store-types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";


const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        token: undefined,
        isAuthenticated: false,
        email: undefined,  


        setToken: (token: string) => set({ token }),
        setAuthenticate: (value: boolean) => set({ isAuthenticated: value }),
        setEmail: (email: string) => set({ email }), 
      }),
      { name: "AuthStore" }  
    )
  )
);

export default useAuthStore;
