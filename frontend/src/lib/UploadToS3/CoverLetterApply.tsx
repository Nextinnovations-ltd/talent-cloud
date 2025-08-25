/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getTokenFromLocalStorage,
    getTokenFromSessionStorage,
  } from "@/helpers/operateBrowserStorage";
import { URL } from "@/services/api/apiurls";
import axios from "axios";


type CoverLetterUploadProps = {
    uploadId:string;
    postId:string
}

export async function CoverLetterApply({uploadId,postId}:CoverLetterUploadProps):Promise<unknown>{
    try {

      const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

         await axios.post(
            `${URL}job-posts/${postId}/apply/`,
            {
              cover_letter_upload_id: uploadId,
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );



        return undefined;
    }catch (error:any) {
        console.error('Error confirming upload:', error);
        throw new Error(error.response?.data?.message || 'Failed to confirm upload');
      }
}
