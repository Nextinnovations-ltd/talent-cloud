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
};

export type UserProfileFormValues = Partial<UserProfile>;
