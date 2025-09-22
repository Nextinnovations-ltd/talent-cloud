/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
} from "@/helpers/operateBrowserStorage";
import { URL } from "@/services/api/apiurls";
import fileUploadTypes from "@/types/upload-s3-types";


type ConfirmUploadProps = {
  uploadId: string;
  fileSize: number;
  type?: fileUploadTypes
}

export async function ComfirmUpload({ uploadId, fileSize, type }: ConfirmUploadProps): Promise<unknown> {
  try {

    const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

    let url;

    if (type === 'profile') {
      url = "jobseeker/profile/upload/confirm/"
    } else if (type === 'resume') {
      url = "jobseeker/application/upload/confirm/"
    } else if (type === 'defaultResume') {
      url = "jobseeker/profile/upload/confirm/"
    }


    const response = await axios.post(
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
  } catch (error: any) {
    console.error('Error confirming upload:', error);
    throw new Error(error.response?.data?.message || 'Failed to confirm upload');
  }
}