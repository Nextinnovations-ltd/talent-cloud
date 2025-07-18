import { WorkExperience } from "@/types/job-seeker-types";
import apiSlice from "../api/apiSlice";

interface JobSeekerCredentials {
  profile_image_url?: string;
  name: string;
  username: string;
  email: string;
  tagline: string;
  role: number;
  experience_level: number;
  experience_years: number;
  country_code: string;
  phone_number: string;
  date_of_birth: string;
  address: string;
  bio: string;
  resume_url?: string
  is_open_to_work: boolean
  linkedin_url?: string;
  behance_url?: string;
  portfolio_url?: string;
  github_url?: string;
  facebook_url?: string
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

interface OptionsItemType {
  id: number;
  name: string;
}

export interface UseJobSeekerProfileResponse {
  status: boolean;
  message: string;
  data: {
    profile_image_url: string;
    name: string;
    username: string;
    email: string;
    tagline: string;
    role: OptionsItemType;
    specialization:OptionsItemType;
    experience_level: LabelType;
    experience_years: number;
    country_code: string;
    phone_number: string;
    date_of_birth: string;
    bio: string;
    resume_url: string;
    is_open_to_work: boolean;
    linkedin_url?: string;
    behance_url?: string;
    portfolio_url?: string;
    github_url?: string;
    facebook_url?: string;
    address: {
      country: { id: number, name: string },
      address: string,
      city: { id: number, name: string }
    }
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
  data: {
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


interface CertificationsCredentials {
  title: string,
  organization: string,
  issued_date: string,
  expiration_date: string,
  has_expiration_date: boolean,
  url: string
}
interface CertificationsCredentialsWithId extends CertificationsCredentials {
  id: number; // or string, if your ID is a UUID
}

interface CertificaitonsResponse {
  status: boolean;
  message: string;
  data: CertificationsCredentialsWithId[];
}



interface ApplyJobArg {
  jobId: number;
  credentials: Record<string, unknown>; // or a more specific type if known
}


interface JobSeekerEducationCredentials {
  degree: string;
  institution: string;
  start_date: string;
  end_date: string;
  description: string;
  is_currently_attending: boolean;
  id: number
}

interface JobSeekerEducationResponse {
  status: boolean;
  message: string;
  data: JobSeekerEducationCredentials[]
}



export interface ProjectCredentials {
  title: string;
  description: string;
  tags: string[];
  project_url?: string; // optional
  project_image_url?: string; // optional
  start_date: string | Date;
  end_date?: string | Date; // optional if is_ongoing is true
  is_ongoing: boolean;
  team_size: number;
}

interface ProjectsCredentialsWithId extends ProjectCredentials {
  id: number; // or string, if your ID is a UUID
}

export interface ProjdctsWithIdResponse {
  status: boolean;
  messages: string;
  data: ProjectsCredentialsWithId
}

interface ProjectsResponse {
  status: boolean;
  messages: string;
  data: ProjectsCredentialsWithId[]
}

export type Skills = {
  id: number;
  title: string;
};

export type JobSeekerSkillsOptionsResponse = {
  status: boolean;
  message: string;
  data: {
    skills: Skills[];
  };
};

interface getVideoResponse {
  status:boolean;
  messages:string;
  data: {
    video_url:string
  }
}

export interface VideoIntroductionCredentials {
  video_url:string
}




//skill

interface Skill {
  id: number;
  title: string;
}

interface JobSeekerSkillsResponse {
  status: boolean;
  message: string;
  data: Skill[];
}






export const extendedJobSeekerSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getJobSeekerSkillsOptions: builder.query<JobSeekerSkillsOptionsResponse, void>({
      query: () => "/jobseeker/skill/selection-options/",
    }),
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
    getExperiences: builder.query<UseExperienceResponse, void>({
      query: () => "/experiences/",
      providesTags: ['JobList'],
    }),
    addExperienceProfile: builder.mutation<unknown, ExperienceCredentials>({
      query: (credentials) => ({
        url: "/experiences/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ['JobList']
    }),
    deleteExperienceById: builder.mutation<WorkExperience, unknown>({
      query: (id) => ({
        url: `/experiences/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ['JobList'],
    }),
    updateExperienceProfile: builder.mutation<unknown, ApplyJobArg>({
      query: ({ jobId, credentials }) => ({
        url: `/experiences/${jobId}/`,
        method: "PUT",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ['JobList'],
    }),
    getExperienceById: builder.query<WorkExperience, unknown>({
      query: (id) => `/experiences/${id}/`,
      providesTags: ['JobList'],
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
    getCertifications: builder.query<CertificaitonsResponse, void>({
      query: () => "/certifications/",
      providesTags: ['CertificationList'],
    }),
    addCertification: builder.mutation<unknown, CertificationsCredentials>({
      query: (credentials) => ({
        url: "/certifications/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ['CertificationList']
    }),
    getCerificationById: builder.query<CertificationsCredentials, unknown>({
      query: (id) => `/certifications/${id}/`,
      providesTags: ['CertificationList'],
    }),
    deleteCertificationById: builder.mutation<unknown, number | string>({
      query: (id) => ({
        url: `/certifications/${id}/`,
        method: "DELETE"
      }),
      invalidatesTags: ['CertificationList'],
    }),
    updateCertification: builder.mutation<CertificaitonsResponse, { id: number | string; credentials: unknown }>({
      query: ({ id, credentials }) => ({
        url: `/certifications/${id}/`,
        method: "PUT",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ['CertificationList'],
    }),
    addEducations: builder.mutation<unknown, JobSeekerEducationCredentials>({
      query: (credentials) => ({
        url: '/educations/',
        method: "POST",
        body: JSON.stringify(credentials)
      }),
      invalidatesTags: ['EducationsList'],
    }),
    getEducations: builder.query<JobSeekerEducationResponse, void>({
      query: () => "/educations/",
      providesTags: ['EducationsList'],
    }),
    getEducationById: builder.query<unknown, number | string>({
      query: (id) => ({
        url: `/educations/${id}/`
      }),
      providesTags: ['EducationsList'],
    }),
    deleteEducationById: builder.mutation<unknown, number | string>({
      query: (id) => ({
        url: `/educations/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['EducationsList']
    }),
    updateEducation: builder.mutation<unknown, { id: number | string; credentials: JobSeekerEducationCredentials }>({
      query: ({ id, credentials }) => ({
        url: `/educations/${id}/`,
        method: "PUT",
        body: JSON.stringify(credentials)
      }),
      invalidatesTags: ['EducationsList']
    }),
    getSelectedProjects: builder.query<ProjectsResponse, void>({
      query: () => '/jobseeker/projects/',
      providesTags: ['selectprojectsList']
    }),
    getSelectedProjectsById: builder.query<ProjdctsWithIdResponse, number | string | null>({
      query: (id) => ({
        url: `/jobseeker/projects/${id}/`
      }),
      providesTags: ['selectprojectsList']
    }),
    deleteSelectedProjects: builder.mutation<unknown, number | string>({
      query: (id) => ({
        url: `/jobseeker/projects/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['selectprojectsList']
    }),
    updateSelectedProjects: builder.mutation<unknown, { id: number | string; credentials: ProjectCredentials }>({
      query: ({ id, credentials }) => ({
        url: `/jobseeker/projects/${id}/`,
        method: "PUT",
        body: JSON.stringify(credentials)
      }),
      invalidatesTags: ['selectprojectsList']
    }),
    addSelectedProjects: builder.mutation<unknown, ProjectCredentials>({
      query: (credentials) => ({
        url: "/jobseeker/projects/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ['selectprojectsList']
    }),
    getVideoIntroduction:builder.query<getVideoResponse , void>({
      query: () => '/jobseeker/video-introduction/',
      providesTags: ['videoIntroductionList'],
    }),
    addVideoIndroduction:builder.mutation<getVideoResponse,VideoIntroductionCredentials>({
      query: (credentials) => ({
        url: "/jobseeker/video-introduction/",
        method: "POST",
        body: JSON.stringify(credentials),
      }),
      invalidatesTags: ['videoIntroductionList']
    }),
    //skill
    getJobSeekerUserSkills: builder.query<JobSeekerSkillsResponse, void>({
      query: () => "/jobseeker/skill/",
    
    }),

   
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
  useGetJobSeekerUserSkillsQuery,
  useGetExperienceByIdQuery,
  useUpdateExperienceProfileMutation,
  useDeleteExperienceByIdMutation,
  useGetCertificationsQuery,
  useGetCerificationByIdQuery,
  useAddCertificationMutation,
  useDeleteCertificationByIdMutation,
  useUpdateCertificationMutation,
  useGetEducationsQuery,
  useAddEducationsMutation,
  useGetEducationByIdQuery,
  useDeleteEducationByIdMutation,
  useUpdateEducationMutation,
  useGetSelectedProjectsByIdQuery,
  useGetSelectedProjectsQuery,
  useAddSelectedProjectsMutation,
  useDeleteSelectedProjectsMutation,
  useUpdateSelectedProjectsMutation,
  useGetJobSeekerSkillsOptionsQuery,
  useAddVideoIndroductionMutation,
  useGetVideoIntroductionQuery,
} = extendedJobSeekerSlice;
