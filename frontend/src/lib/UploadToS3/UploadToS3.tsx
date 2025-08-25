
import ApplyCoverLetter from '@/components/jobApply/ApplyCoverletter';
import { ComfirmUpload } from './ConfirmUpload';
import { generatePresignedUrl } from './GeneratePresignedUrl';
import { uploadToCloud } from './UploadData';
import { CoverLetterApply } from './CoverLetterApply';

type UploadToS3Props = {
    file:File,
    type: "profile" | "resume" | "coverLetter"
}

export async function uploadToS3({ file,type }: UploadToS3Props): Promise<boolean> {
    try {
        // Generate presigned URL using the dedicated function
        const presignedUrlData = await generatePresignedUrl({ file,type });

        await uploadToCloud({file:file,uploadData:presignedUrlData?.data})


        // eslint-disable-next-line no-constant-condition
        if (type === 'profile' || 'resume'){
            await ComfirmUpload({uploadId:presignedUrlData?.data?.upload_id,fileSize:file.size});
        }

        console.log(presignedUrlData)

        if (type === 'coverLetter') {
            await CoverLetterApply({uploadId:presignedUrlData?.data?.upload_id,postId:presignedUrlData?.data?.post_id});
        }

       

        // TODO: Use the presigned URL to actually upload the file to S3
        // const uploadResponse = await axios.put(presignedUrlData.upload_url, file, {
        //     headers: {
        //         'Content-Type': presignedUrlData.content_type || file.type
        //     }
        // });

        return true;
    } catch (error) {
        console.error('Error in uploadToS3:', error);
        return false;
    }
}


export default uploadToS3;