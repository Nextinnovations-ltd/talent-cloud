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
}

export interface PaginatedData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface JobPostResponse {
  status: boolean;
  message: string;
  data: PaginatedData<JobPost>;
}

export interface RecentJobPost {
  status: boolean;
  message: string;
  data: JobPost[];
}

export interface RelatedInfoResponse {
  status: boolean;
  message: string;
  data: {
    name: string;
    image_url: string;
  };
}

export interface Applicant {
  applicant_id: number;
  name: string | null;
  applied_date:string;
  phone_number: string | null;
  email: string;
  role: string | null;
  is_open_to_work: boolean;
  address: string | null;
  profile_image_url: string | null;
}

export interface ApplicantsApiResponse {
  status: boolean;
  message: string;
  data: Applicant[];
}

export interface JobSeekerCountResponse  {
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