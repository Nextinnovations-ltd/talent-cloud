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
}

export async function ComfirmUpload({uploadId,fileSize}:ConfirmUploadProps):Promise<unknown>{
    try {

        const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

         await axios.post(
            `${URL}jobseeker/profile/upload/confirm/`,
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



        return undefined;
    }catch (error:any) {
        console.error('Error confirming upload:', error);
        throw new Error(error.response?.data?.message || 'Failed to confirm upload');
      }
}