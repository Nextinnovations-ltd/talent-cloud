import { Job } from "@/types/job-apply";


export interface RecentJobCardResponse {
    status: boolean;
    message:string;
    data:Job[]
}

