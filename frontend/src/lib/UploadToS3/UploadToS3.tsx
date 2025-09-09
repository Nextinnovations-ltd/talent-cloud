/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ComfirmUpload } from './ConfirmUpload';
import { generatePresignedUrl } from './GeneratePresignedUrl';
import { uploadToCloud } from './UploadData';

type UploadToS3Props = {
    file:File,
    type: "profile" | "resume" | "coverLetter" | "project",
    postId?: string
}

export async function uploadToS3({ file,type,postId }: UploadToS3Props): Promise<boolean | string | unknown> {
    try {
        // Generate presigned URL using the dedicated function
        const presignedUrlData = await generatePresignedUrl({ file,type });



        await uploadToCloud({file:file,uploadData:presignedUrlData?.data})
         
         if (type === 'profile' || type === 'resume'){
            const response = await ComfirmUpload({
                uploadId:presignedUrlData?.data?.upload_id,
                fileSize:file.size,
                type:type
            });


                //@ts-ignore
            return response?.data?.data?.upload_id;
         }

        // if (type === 'coverLetter') {
        //     await CoverLetterApply({uploadId:presignedUrlData?.data?.upload_id,postId:postId!});
        // }
       if(type === 'project'){
          return presignedUrlData?.data?.upload_id
       }

       if( type === 'coverLetter' && postId){
        return presignedUrlData?.data?.upload_id
       }

        

        return true;
    } catch (error) {
        console.error('Error in uploadToS3:', error);
        return false;
    }
}


export default uploadToS3;