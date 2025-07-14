export type UserProfile = {
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
  date_of_birth?: string;
  address?: string;
  bio?: string;
  resume_url?: string;
  is_open_to_work:boolean;
  linkedin_url?:string;
  behance_url?:string;
  portfolio_url?:string;
  github_url?:string;
  facebook_url?:string;
  country:number,
  city:number,
};

export type WorkExperience = {
  id: number;
  title: string;
  organization: string;
  job_type: string | null;
  work_type: string | null;
  start_date: string; // Consider using Date if you parse it
  end_date: string | null;
  description: string;
  is_present_work: boolean;
  user: number;
};

export type UserProfileFormValues = Partial<UserProfile>;
