import apiSlice from "../api/apiSlice";

interface UserSpecializationResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    industry: number;
  }[];
}

interface UserSkillsResponse {
  id: number;
  title: string;
}

interface UserSkillsFullResponse {
  status: boolean;
  message: string;
  data: UserSkillsResponse[];
}

interface UserProfessionalData {
  id: number;
  level: string;
}

interface UserProfessionalsResponse {
  status: boolean;
  message: string;
  data: UserProfessionalData[];
}

interface UserTalentsResponse {
  id: number;
  name: string;
  description: string;
}

interface UserTalentsFullResponse {
  status: boolean;
  message: string;
  data: UserTalentsResponse[];
}

interface SpecializationByIndustryResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    name: string;
  }[];
}

export const extendedOnBoardingSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserSpecialization: builder.query<UserSpecializationResponse, void>({
      query: () => "/roles/",
    }),
    getUserTalents: builder.query<UserTalentsFullResponse, void>({
      query: () => "/specializations/",
    }),
    getSkillSets: builder.query<UserSkillsFullResponse, void>({
      query: () => "/skills",
    }),
    getProfessionals: builder.query<UserProfessionalsResponse, void>({
      query: () => "/experience-levels/",
    }),
    getSpecializationsByIndustryId: builder.query<SpecializationByIndustryResponse, number>({
       query:(id)=>`/roles/by-specialization/${id}/`
    }),
  }),
});

export const {
  useGetUserSpecializationQuery,
  useGetSkillSetsQuery,
  useGetProfessionalsQuery,
  useGetUserTalentsQuery,
  useGetSpecializationsByIndustryIdQuery,
} = extendedOnBoardingSlice;
