import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { revertAll } from "../slices/authSlice";
import apiSlice from "./apiSlice";

// Define the user state type
interface UserStateResponse {
  status: boolean;
  message: string;
  data: {
    profile_image_url: string;
    role: string;
    onboarding_step: number;
    is_generated_username: boolean;
  };
}

// Define the initial state for the user slice
const initialState = {
  profile_image_url: "",
  role: "",
  onboarding_step: 0,
  is_generated_username: false,
};

// Extend `apiSlice` with the new endpoints
export const extendedUserSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query<UserStateResponse, void>({
      query: () => "/auth/me/",
      keepUnusedDataFor: 0
    }),
  }),
});

// Extract the hook for the `getUserInfo` query
export const { useGetUserInfoQuery } = extendedUserSlice;

// Create the `userSlice`
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(revertAll, () => initialState);
    builder.addMatcher(
      extendedUserSlice.endpoints.getUserInfo.matchFulfilled,
      (state, { payload }: PayloadAction<UserStateResponse>) => {

        state.is_generated_username = payload.data.is_generated_username;
        state.onboarding_step = payload.data.onboarding_step;
        state.profile_image_url = payload.data.profile_image_url;
        state.role = payload.data.role;
      }
    );
  },
});

export default userSlice.reducer;

export const selectUserProfile = (state: any) => state.user.profile_image_url;
export const selectUserRole = (state: any) => state.user.role;
export const selectUserOnboardingStep = (state: any) => state.user.role;
export const selectUserIsGenerated = (state: any) =>
  state.user.is_generated_username;
