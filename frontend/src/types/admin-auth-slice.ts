export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JobPost {
  id: number;
  title: string;
  company: string;
  specialization_name: string;
  job_post_status: string;
  applicant_count: number;
  view_count: number;
  posted_date: string; // ISO datetime string
  deadline_date: string; // ISO date string
  job_post_id: string;
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export interface ResponseData<T>{
   status:boolean;
   message:string;
   data:T
}

export type JobPostResponse  = ResponseData<PaginatedData<JobPost>>;

export type RecentJobPost =  ResponseData<JobPost[]> ;

export interface RelatedInfoResponse {
  status: boolean;
  message: string;
  data: {
    name: string;
    image_url: string;
  };
}

export type JobPostDetails = {
  id: number;
  created_at: string;
  updated_at: string;
  status: boolean;
  title: string;
  specialization: string;
  role: string;
  job_type: string;
  location: string;
  work_type: string;
  description: string;
  responsibilities: string;
  requirements: string;
  offered_benefits: string;
  salary_mode?: string;
  salary_type: string;
  salary_min?: string | null;
  salary_max?: string | null;
  is_salary_negotiable: boolean;
  project_duration?: string;
  skills?: string[];
  experience_level?: string;
  experience_years?: string;
  salary_fixed?: string | null;
  number_of_positions: number;
  last_application_date: string;
};

export type  EditJobDetailResponse = ResponseData<JobPostDetails> ;


export interface Applicant {
  applicant_id: number;
  application_id: number;
  name: string | null;
  applied_date: string;
  phone_number: string | null;
  email: string;
  role: string | null;
  is_open_to_work: boolean;
  is_shortlisted: boolean;
  address: string | null;
  profile_image_url: string | null;
  job_post_id: string | null;
  application_status: string | null;
  resume_url: string | null ;
  cover_letter_url: string | null;
}

export type  ApplicantsApiResponse = ResponseData<PaginatedData<Applicant>>;

export interface JobSeekerCountResponse {
  status: boolean;
  message: string;
  data: {
    total_job_posts: number;
    job_post_applicants_count: number;
    job_post_bookmarks_count: number;
    completed_profiles_count: number;
    job_post_active: {
      count: number;
      percent: number;
    };
    job_post_draft: {
      count: number;
      percent: number;
    };
    job_post_expired: {
      count: number;
      percent: number;
    };
    job_post_views_count: number;
    total_user_count: number;
    unverified_user_count: number;
    verified_user_count: number;
  };
};

export interface ShortListMutationResopnse {
  status: boolean;
  message: string;
  data: null
}

export type JobSeekerOverviewResponse = {
  status: boolean;
  message: string;
  data: {
    name: string;
    email: string;
    bio: string | null;
    age:number | null;
    phone_number: string | null;
    address: string | null;
    is_open_to_work: boolean;
    expected_salary: string  | null;
    profile_image_url: string | null;
    resume_url: string | null;
    cover_letter_url: string | null;
    occupation: {
      specialization_name: string | null;
      role_name: string | null;
      experience_level: string | null;
      experience_years: number | null;
      skills: string[];
    };
    social_links: {
      facebook_url: string | null;
      linkedin_url: string | null;
      behance_url: string | null;
      portfolio_url: string | null;
      github_url: string | null;
    };
    recent_application: {
      position: string;
      company: string;
      salary: string | number;
      total_applicants: number;
      applied_date: string; // ISO timestamp
      last_application_date: string; // Date string (YYYY-MM-DD)
    } | null;
    recent_applied_jobs: {
      job_id: number;
      position: string;
      applicant_count: number;
      applied_date: string; // ISO timestamp
      company: string;
      skills: string[];
      salary: string | number;
    }[];
  };
};

type Project = {
  id: number;
  title: string;
  description: string;
  project_image_url: string;
  tags:string[]
};

export type JobSeekerProjectListResponse = {
  status: boolean;
  message: string;
  data: Project[];
};



export type JobSeekerDetailVideoResponse = {
  status: boolean;
  message: string;
  data: string
}

type Experience = {
  description: string;
  duration: string;
  id: number;
  organization: string;
  title: string
}

export type JobSeekerDetailExperience = {
  status: boolean;
  message: string;
  data: Experience[]
}

type Education = {
  id: number,
  degree: string,
  institution: string,
  description: string,
  duration: string
}

export type JobSeekerEducationDetail = {
  status: boolean;
  message: string;
  data: Education[];
}

type Certifications = {
  credential_id: number;
  duration: string;
  id: number;
  organization: string;
  title: string;
  url: string
}

export type JobSeekerCertificationDetail = {
  status: boolean;
  message: string;
  data: Certifications[]
}

export type CandidatesResponse = {
  address: string,
  applicant_id: number,
  application_id: number,
  application_status: string,
  applied_date: string,
  cover_letter_url: string,
  email: string,
  experience_years: number,
  is_open_to_work: boolean,
  job_post_id: number,
  name: string,
  phone_number: string,
  profile_image_url: string,
  resume_url: string,
  role: string,
}

export type JobSeekerCandidatesResponse = {
  status: boolean;
  message: string;
  data:PaginatedData<Applicant>
}

export type ResumeTypeItem = {
  id:number,
  is_default:boolean,
  resume_url:string,
  uploaded_at:string,
  original_file_name:string
}

export type ResumeListResponse = ResponseData<ResumeTypeItem[]>;