import filesTypes from '../filesTypes'
import axios from "axios";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
} from "@/helpers/operateBrowserStorage";
import { URL } from '@/services/api/apiurls';
import { PresignedUrlResponse } from '@/types/file-upload-types';

type GeneratePresignedUrlProps = {
  file: File
}




export async function generatePresignedUrl({ file }: GeneratePresignedUrlProps): Promise<PresignedUrlResponse> {

  const correctMimeType = filesTypes.getCorrectMimeType(file);

  const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

  const response = await axios.post(
    `${URL}job-seekers/profile/upload/image/`,
    {
      filename: file.name,
      file_size: file.size,
      content_type: correctMimeType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  

  console.log(response.data)

  return response.data;
}

export default generatePresignedUrl;