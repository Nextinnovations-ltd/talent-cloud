import apiSlice from "../api/apiSlice";


// APISLICE
export  const extendedUploadToS3Slice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getPresignedUrl:builder.query<unknown,unknown>({
            query:(params)=>  `/s3/upload/generate-url/?${params}`
        })
    })
});

export const {useGetPresignedUrlQuery} = extendedUploadToS3Slice;
