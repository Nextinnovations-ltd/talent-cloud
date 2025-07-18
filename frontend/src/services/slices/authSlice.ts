import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiSlice from "../api/apiSlice";
import {
  getKeepMeLoggedInFromLocalStorage,
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
  setTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
  removeTokenFromSessionStorage,
  setTokenToSessionStorage,
  removeTokensFromLocalStorage,
} from "@/helpers/operateBrowserStorage";
// Define the shape of the login response

interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    token: string;
    is_generated_username: boolean;
  };
}

interface RegisterResponse {
  status: boolean;
  message: string;
  data: unknown;
}

interface TokenCredentials {
  token: string;
  action: string;
}

// Define the shape of the login credentials
interface LoginCredentials {
  email: string;
  password: string;
}

// Define the reactivae Token
interface ReactivateTokenCredentials {
  token: string;
}

// Define the shape of the TokenCredentials
interface TokenVeriyCredentials {
  token: string;
  verification_code: string;
}

interface TokenVerify {
  token: string;
}

interface TokenOAuthVerifyResponse {
  token: string;
}

//Define the response of the TokenCredentials
interface ResponseTokenVerifyCredentials {
  status: boolean;
  message: string;
  data: null | object;
}

// Define the shape of the initial state
interface AuthState {
  token: string | null;
  keepMeLoggedIn: boolean;
  isGeneratedName: boolean;
}

export const revertAll = createAction("REVERT_ALL");

// Inject endpoints for login and sign-up
export const extendedAuthSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    signUp: builder.mutation<RegisterResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/register/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    tokenVerify: builder.mutation<null, TokenCredentials>({
      query: (credentials) => ({
        url: "/auth/check-token-validity/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    registerActivation: builder.mutation<null, TokenVeriyCredentials>({
      query: (credentials) => ({
        url: "/auth/verify-registration/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    reactiavateToken: builder.mutation<
      ResponseTokenVerifyCredentials,
      ReactivateTokenCredentials
    >({
      query: (credentials) => ({
        url: "/auth/resend-activation/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    forgotPassword: builder.mutation<null, null>({
      query: (credentials) => ({
        url: "/auth/forget-password/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    resetPassword: builder.mutation<null, null>({
      query: (credentials) => ({
        url: "/auth/reset-password/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    updateUserName: builder.mutation<null, null>({
      query: (credentials) => ({
        url: "/update-username/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    onBoarding: builder.mutation<unknown, null>({
      query: (credentials) => ({
        url: "/onboarding/",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      }),
    }),
    verifyToken: builder.mutation<null, TokenVerify>({
      query: (credentials) => ({
        url: "/auth/verify-token/",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<null, null>({
      query: (credentials) => ({
        url: "/auth/refresh-token/",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyOAuthToken: builder.mutation<TokenOAuthVerifyResponse, TokenVerify>({
      query: (credentials) => ({
        url: "/auth/verify-oauth/",
        method: "POST",
        body: credentials,
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

// Define the initial state
const initialState: AuthState = {
  token,
  keepMeLoggedIn: !!getKeepMeLoggedInFromLocalStorage(),
  isGeneratedName: true,
};

// Create the auth slice
const authSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setKeepLoggedIn: (state, { payload }) => {
      state.keepMeLoggedIn = payload.value;
    },
    setReauthToken: (state, { payload }) => {
      state.token = payload;
      setTokenToLocalStorage(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertAll, (state) => {
      state.token = "";
      state.keepMeLoggedIn = false;
    });
    builder.addMatcher(
      extendedAuthSlice.endpoints?.login.matchFulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        if (action.payload.data.token) {
          state.token = action.payload.data.token;
          state.isGeneratedName = action.payload.data.is_generated_username;
          // state.isGeneratedName = action.payload.data

          // Handle token storage based on keepMeLoggedIn flag
          if (state.keepMeLoggedIn) {
            setTokenToLocalStorage(action.payload.data.token);
            setRefreshTokenToLocalStorage(action.payload.data.token);
            removeTokenFromSessionStorage();
          } else {
            setTokenToSessionStorage(action.payload.data.token);
            removeTokensFromLocalStorage();
          }
        }
      }
    );
  },
});

// Export the hooks for login and sign-up
export const {
  useLoginMutation,
  useSignUpMutation,
  useTokenVerifyMutation,
  useRegisterActivationMutation,
  useReactiavateTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateUserNameMutation,
  useOnBoardingMutation,
  useVerifyTokenMutation,
  useRefreshTokenMutation,
  useVerifyOAuthTokenMutation,
} = extendedAuthSlice;

export const { setKeepLoggedIn, setReauthToken } = authSlice.actions;
export const selectToken = (state: any) => state.auth.token;
export const getIsGeneratedUsername = (state: any) =>
  state.auth.isGeneratedName;
export const selectKeepMeLoggedIn = (state: any) => state.auth.keepMeLoggedIn;

export default authSlice.reducer;
