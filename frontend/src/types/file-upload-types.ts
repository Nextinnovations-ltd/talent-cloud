export type PresignedFileData = {
    upload_id: string;
    upload_url: string;
    fields: {
        "Content-Type": string;
        key: string;
        AWSAccessKeyId: string;
        policy: string;
        signature: string;
    };
    file_path: string;
    expires_in: number;
    expected_content_type: string;
    instructions: {
        method: string;
        description: string;
        important: string;
    };
}

export type PresignedUrlResponse = {
    status: boolean;
    message: string;
    data: PresignedFileData
}