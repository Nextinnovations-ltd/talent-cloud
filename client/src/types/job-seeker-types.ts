export type UserProfile = {
  name: string;
  username: string;
  specialization_id: number;
  experience_level_id: number;
  phone_number: string;
  country_code: string;
  address: string;
  bio: string;
  profile_image_url?: File | string | null;
  facebook_url?: string;
  linkedin_url?: string;
  behance_url?: string;
  portfolio_url?: string;
};
