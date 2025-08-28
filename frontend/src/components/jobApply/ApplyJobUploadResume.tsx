/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone, FileRejection } from "react-dropzone";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Upload } from "lucide-react";
import UploadToS3 from "@/lib/UploadToS3/UploadToS3";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useGetJobSeekerResumeQuery } from "@/services/slices/jobSeekerSlice";
import { useParams } from "react-router-dom";
import filesTypes from "@/lib/filesTypes";

type applyJobUploadResumeProps = {
    type: "profile" | "resume" | "coverLetter",
    setFileData?: Dispatch<SetStateAction<any>>,
    coverError?: boolean
}

const ApplyJobUploadResume: React.FC<applyJobUploadResumeProps> = ({ type, setFileData, coverError }) => {
    const [error, setError] = useState<string>("");
    const [rejections, setRejections] = useState<FileRejection[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [__, setUploadedUrl] = useState<string | null>(null); // optional: store result

    const { refetch } = useGetJobSeekerResumeQuery();
    const { id } = useParams();


    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
    } = useDropzone({
        accept: filesTypes.ACCEPTED_TYPES,
        maxSize: filesTypes.MAX_SIZE,
        multiple: false, // single file only
        disabled: isUploading, // disable while uploading
        onDropAccepted: () => {
            setError("");
            setRejections([]);
        },
        onDropRejected: (rej) => {
            setRejections(rej);
            const first = rej[0]?.errors?.[0];
            const msg =
                first?.code === "file-too-large"
                    ? "File size must be less than 10MB."
                    : first?.code === "file-invalid-type"
                        ? `Unsupported file type. Allowed: ${filesTypes.friendlyAllowed}.`
                        : "File rejected. Please check the file type and size.";
            setError(msg);
        },
    });

    const file = acceptedFiles[0] ?? null;

    // Upload when a file is selected
    useEffect(() => {
        if (!file) return;

        if (type === 'coverLetter') {
            if (setFileData) {
                setFileData(acceptedFiles[0] ?? null);
            }

            return;
        }

        let cancelled = false;

        const doUpload = async () => {
            setError("");
            setIsUploading(true);
            setUploadedUrl(null);

            try {
                // call your UploadToS3 helper — adjust return handling if it returns more data
                const result = await UploadToS3({ file, type: type, postId: id });

                if (cancelled) return;

                // if UploadToS3 returns a boolean
                if (result === true) {
                    setUploadedUrl("uploaded-success"); // replace with actual url if UploadToS3 returns one
                } else if (typeof result === "string") {
                    // maybe it returns a URL
                    setUploadedUrl(result);
                } else {
                    // fallback generic success handling
                    setUploadedUrl(null);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("UploadToS3 error:", err);
                    setError("Upload failed. Please try again.");
                }
            } finally {
                if (!cancelled) setIsUploading(false);
                refetch(); // refetch resume data after upload
            }
        };

        doUpload();

        return () => {
            cancelled = true;
        };
    }, [file]);



    return (
        <>
            <section className="container">
                <div
                    {...getRootProps()}
                    className={`border-2 cursor-pointer p-4 ml-8 w-[220px] rounded border-dashed transition-colors duration-200 select-none
    ${coverError
                            ? "border-red-500 bg-red-50"
                            : isDragReject
                                ? "border-red-500 bg-red-50"
                                : isDragActive
                                    ? "border-blue-500 bg-blue-100"
                                    : "border-blue-200 bg-blue-50"
                        }
    ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                    aria-label="Upload resume"
                >

                    <input {...getInputProps({ disabled: isUploading })} /> {/* ✅ disable input */}
                    <div className="flex font-medium text-sm items-center justify-center gap-3">
                        <p>{isUploading ? "Uploading..." : "Upload"}</p>
                        {
                            !isUploading && <Upload size={16} />
                        }
                        {
                            isUploading && <LoadingSpinner className="w-[15px] h-[15px]" />
                        }
                    </div>
                    <p className="text-xs text-gray-600 text-center mt-2">
                        {filesTypes.friendlyAllowed} · Max 10MB
                    </p>
                </div>
                {!!(rejections.length || fileRejections.length) && (
                    <aside className="mt-3 ml-8">
                        <h4 className="text-sm font-medium text-red-600 mb-1">Rejected</h4>
                        <ul className="list-disc ml-5 text-sm text-red-600">
                            {(rejections.length ? rejections : fileRejections).map(({ file, errors }) => (
                                <li key={file.name}>
                                    {file.name} — {errors.map((e) => e.message).join(", ")}
                                </li>
                            ))}
                        </ul>
                    </aside>
                )}
            </section>

            {error && (
                <p className="text-[12px] mt-[10px] font-medium text-red-600 ml-8">
                    {error}
                </p>
            )}
        </>
    );
};

export default ApplyJobUploadResume;
