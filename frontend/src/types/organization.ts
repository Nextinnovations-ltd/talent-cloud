import { Job } from "./job-apply";

export interface Company {
  id: number;
  name: string;
  slug: string;
  address: string;
  image_url: string;
  website: string;
  why_join_us: string | null;
  description: string;
  industry: string; // You can replace with actual `Industry` type if available
  size: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  founded_date: string;
  is_verified: boolean;
  company_image_urls: string[];
  job_posts: Job[];
  created_at: string;
  updated_at: string;
}
  