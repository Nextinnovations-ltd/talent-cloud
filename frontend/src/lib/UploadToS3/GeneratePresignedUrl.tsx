import filesTypes from '../filesTypes'
import axios from "axios";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
} from "@/helpers/operateBrowserStorage";
import { URL } from '@/services/api/apiurls';
import { PresignedUrlResponse } from '@/types/file-upload-types';

type GeneratePresignedUrlProps = {
  file: File,
  type: "profile" | "resume" | "coverLetter"
}




export async function generatePresignedUrl({ file,type }: GeneratePresignedUrlProps): Promise<PresignedUrlResponse> {

  const correctMimeType = filesTypes.getCorrectMimeType(file);

  const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

  let uploadEndpoint = '';

  if (type === 'profile') {
    uploadEndpoint = 'profile/upload/image/';
  } else if (type === 'resume') {
    uploadEndpoint = 'profile/upload/resume/';
  }


  const response = await axios.post(
    `${URL}jobseeker/${uploadEndpoint}`,
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