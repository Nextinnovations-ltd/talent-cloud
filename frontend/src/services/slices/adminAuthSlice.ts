import { LoginCredentials } from "@/types/admin-auth-slice";
import apiSlice from "../api/apiSlice";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getKeepMeLoggedInFromLocalStorage,
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  setTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  removeTokenFromSessionStorage,
} from "@/helpers/operateBrowserStorage";

// Define the shape of the initial state
interface AuthState {
  token: string | null;
}

interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
  };
}

export const revertAll = createAction("REVERT_ALL");

export const extendedAdminAuthSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/admin/login/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
  }),
});

const token: string | null =
  getKeepMeLoggedInFromLocalStorage() && getTokenFromLocalStorage()
    ? getTokenFromLocalStorage()
    : getTokenFromSessionStorage()
    ? getTokenFromSessionStorage()
    : getTokenFromLocalStorage();

const initialState: AuthState = {
  token,
};

const adminAuthSlice = createSlice({
  name: "adminToken",
  initialState,
  reducers: {
    setReauthToken: (state, { payload }) => {
      state.token = payload;
      setTokenToLocalStorage(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, (state) => {
      state.token = "";
    });
    builder.addMatcher(
      extendedAdminAuthSlice.endpoints?.adminLogin.matchFulfilled,
      (state, action: PayloadAction<LoginResponse>) => {

        console.log("3er3434")
        console.log(action?.payload)
        console.log("3er3434")


        if (action.payload.data.token) {
          state.token = action.payload.data.token;
          // For admin, always store in localStorage. Adjust if you have a keepMeLoggedIn flag for admin.
          setTokenToLocalStorage(action.payload.data.token);
          setRefreshTokenToLocalStorage(action.payload.data.token);
          removeTokenFromSessionStorage();
        }
      }
    );
  },
});

export const { useAdminLoginMutation } = extendedAdminAuthSlice;
export const { setReauthToken } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;