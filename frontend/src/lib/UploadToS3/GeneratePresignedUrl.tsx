import filesTypes from '../filesTypes'
import axios from "axios";
import {
  getTokenFromLocalStorage,
  getTokenFromSessionStorage,
} from "@/helpers/operateBrowserStorage";
import { URL } from '@/services/api/apiurls';
import { PresignedUrlResponse } from '@/types/file-upload-types';
import fileUploadTypes from '@/types/upload-s3-types';

type GeneratePresignedUrlProps = {
  file: File,
  type:fileUploadTypes,
}




export async function generatePresignedUrl({ file,type }: GeneratePresignedUrlProps): Promise<PresignedUrlResponse> {

  const correctMimeType = filesTypes.getCorrectMimeType(file);

  const token: string | null = getTokenFromLocalStorage() || getTokenFromSessionStorage();

  let uploadEndpoint = '';

  if (type === 'profile') {
    uploadEndpoint = 'jobseeker/profile/upload/image/';
  } else if (type === 'resume') {
    uploadEndpoint = 'jobseeker/application/upload/resume/';
  } else if (type === 'coverLetter') {
    uploadEndpoint = 'application/upload/cover-letter/ '
  }else if (type === 'project'){
    uploadEndpoint = 'jobseeker/projects/upload/project-image/'
  }else if (type === 'defaultResume'){
    uploadEndpoint = 'jobseeker/profile/upload/resume/'
  }


  const response = await axios.post(
    `${URL}${uploadEndpoint}`,
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
  

  return response.data;
}

export default generatePresignedUrl;