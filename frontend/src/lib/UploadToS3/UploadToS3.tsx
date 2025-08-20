
import { ComfirmUpload } from './ConfirmUpload';
import { generatePresignedUrl } from './GeneratePresignedUrl';
import { uploadToCloud } from './UploadData';

type UploadToS3Props = {
    file:File
}

export async function uploadToS3({ file }: UploadToS3Props): Promise<boolean> {
    try {
        // Generate presigned URL using the dedicated function
        const presignedUrlData = await generatePresignedUrl({ file });

        await uploadToCloud({file:file,uploadData:presignedUrlData?.data})

        await ComfirmUpload({uploadId:presignedUrlData?.data?.upload_id,fileSize:file.size});

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