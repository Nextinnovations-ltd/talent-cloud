/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PresignedFileData } from "@/types/file-upload-types";
import filesTypes from '../filesTypes'
import axios from "axios";

type UploadToS3Props = {
    file: File,
    uploadData: PresignedFileData
}

export async function uploadToCloud({ file, uploadData }: UploadToS3Props): Promise<boolean> {
    try {

        const formData = new FormData();

        Object.entries(uploadData.fields).forEach(([key, value]) => {
            console.log(`Adding field: ${key} = ${value}`);
            formData.append(key, value);
        });

        const correctMimeType = filesTypes?.getCorrectMimeType(file);

        if (uploadData.fields['Content-Type']) {
            const blob = new Blob([file], { type: uploadData.fields['Content-Type'] });
            formData.append('file', blob, file.name);
        } else {
            const blob = new Blob([file], { type: correctMimeType });
            formData.append('file', blob, file.name);
        }
        await axios.post(uploadData.upload_url, formData, {
            // Don't set Content-Type header - let the browser set it for multipart/form-data
            onUploadProgress: (progressEvent) => {
                //@ts-ignore
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                console.log(progress)
            }
        });


        return true;

    } catch (error) {
        console.error("Error in uploadToCloue", error)
        return false;
    }

}