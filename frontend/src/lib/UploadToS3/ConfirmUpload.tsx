/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import {
    getTokenFromLocalStorage,
    getTokenFromSessionStorage,
  } from "@/helpers/operateBrowserStorage";
import { URL } from "@/services/api/apiurls";


type ConfirmUploadProps = {
    uploadId: string;
    fileSize:number;
    type? : "profile" | "resume" | "coverLetter" | "project"
}

export async function ComfirmUpload({uploadId,fileSize,type}:ConfirmUploadProps):Promise<unknown>{
    try {

        const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

        let url;

        if(type === 'profile'){
          url = "jobseeker/profile/upload/confirm/"
        }else{
          url = "jobseeker/application/upload/confirm/"
        }



       const response =  await axios.post(
            `${URL}${url}`,
            {
              upload_id: uploadId,
              file_size: fileSize
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );





        return response;
    }catch (error:any) {
        console.error('Error confirming upload:', error);
        throw new Error(error.response?.data?.message || 'Failed to confirm upload');
      }
}