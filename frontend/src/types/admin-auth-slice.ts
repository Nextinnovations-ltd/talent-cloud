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
    posted_date: string;
    deadline_date: string;
  }
  
  export interface JobPostPaginationData {
    count: number;
    next: string | null;
    previous: string | null;
    results: JobPost[];
  }
  
  export interface JobPostResponse {
    status: boolean;
    message: string;
    data: JobPostPaginationData;
  }
  
export interface RelatedInfoResponse {
    status: boolean;
    message: string;
    data: {
      name: string;
      image_url: string;
    };
}
