/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getTokenFromLocalStorage,
    getTokenFromSessionStorage,
  } from "@/helpers/operateBrowserStorage";
import { URL } from "@/services/api/apiurls";


type CoverLetterUploadProps = {
    uploadId:string;
    postId:string
}

export async function ComfirmUpload({uploadId,postId}:CoverLetterUploadProps):Promise<unknown>{
    try {

        const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();



        return undefined;
    }catch (error:any) {
        console.error('Error confirming upload:', error);
        throw new Error(error.response?.data?.message || 'Failed to confirm upload');
      }
}
