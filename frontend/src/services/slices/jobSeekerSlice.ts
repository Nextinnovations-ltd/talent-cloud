import apiSlice from "../api/apiSlice";

interface JobSeekerCredentials {
    profile_image_url?: string;
    name: string;
    username: string;
    email: string;
    tagline:string;
    role: number;
    experience_level: number;
    experience_years:number;
    country_code: string;
    phone_number: string;
    date_of_birth:string;
    address: string;
    bio: string;
    resume_url?:string
}

//credentials
interface SocialCredentials {
  facebook_url: string;
  linkedin_url: string;
  behance_url: string;
  portfolio_url: string;
}

interface ExperienceCredentials {
  title: string;
  organization: string;
  job_type: string;
  work_type: string;
  start_date: string;
  end_date: string;
  description: string;
  is_present_work: boolean;
}

interface LabelType {
  id: number;
  level: string;
}

interface RoleType {
  id: number;
  name: string;
}

interface UseJobSeekerProfileResponse {
  status: boolean;
  message: string;
  data: {
    profile_image_url: string;
    name: string;
    username: string;
    email: string;
    tagline:string;
    role: RoleType;
    experience_level: LabelType;
    experience_years:number;
    country_code: string;
    phone_number: string;
    date_of_birth:string;
    address: string;
    bio: string;
    resume_url:string
  };
}

interface UseSocialProfileResponse {
  status: boolean;
  message: string;
  data: {
    facebook_url: string;
    linkedin_url: string;
    behance_url: string;
    portfolio_url: string;
  };
}

interface UseExperienceResponse {
  status: boolean;
  message: string;
  data:{
    id: number;
    title: string;
    organization: string;
    job_type: string;
    work_type: string;
    start_date: string;
    end_date: string;
    description: string;
    is_present_work: boolean;
  }[];
}

interface Skill {
  id: number;
  title: string;
}

interface JobSeekerSkillsData {
  skills: Skill[];
}

interface JobSeekerSkillsResponse {
  status: boolean;
  message: string;
  data: JobSeekerSkillsData;
}

export const extendedJobSeekerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addJobSeekerProfile: builder.mutation<unknown, JobSeekerCredentials>({
      query: (credentials) => ({
        url: "/jobseeker/profile/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    addSocialProfile: builder.mutation<unknown, SocialCredentials>({
      query: (credentials) => ({
        url: "/jobseeker/social/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    addExperienceProfile: builder.mutation<unknown, ExperienceCredentials>({
      query: (credentials) => ({
        url: "/experiences/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    getExperienceById:builder.query<unknown,unknown>({
      query:(id)=>`/experiences/${id}`,
    }),

    addJobSeekerSkills: builder.mutation<unknown, void>({
      query: (credentials) => ({
        url: "/jobseeker/skill/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    }),
    getJobSeekerProfile: builder.query<UseJobSeekerProfileResponse, void>({
      query: () => "/jobseeker/profile/",
    }),
    getSocialLink: builder.query<UseSocialProfileResponse, void>({
      query: () => "/jobseeker/social/",
    }),
    getExperiences: builder.query<UseExperienceResponse, void>({
      query: () => "/experiences/",
    }),
    getJobSeekerSkills: builder.query<JobSeekerSkillsResponse, void>({
      query: () => "/jobseeker/skill/selection-options/",
    }),
    getJobSeekerUserSkills:builder?.query<JobSeekerSkillsResponse,void>({
      query:()=>"/jobseeker/skill/"
    })
  }),
});

export const {
  useAddJobSeekerProfileMutation,
  useGetJobSeekerProfileQuery,
  useGetSocialLinkQuery,
  useAddSocialProfileMutation,
  useGetExperiencesQuery,
  useAddExperienceProfileMutation,
  useAddJobSeekerSkillsMutation,
  useGetJobSeekerSkillsQuery,
  useGetJobSeekerUserSkillsQuery,
  useGetExperienceByIdQuery,
} = extendedJobSeekerSlice;
