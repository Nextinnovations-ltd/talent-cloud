/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone, FileRejection } from "react-dropzone";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Trash, Upload, CheckCircle } from "lucide-react";
import UploadToS3 from "@/lib/UploadToS3/UploadToS3";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useGetJobSeekerResumeQuery } from "@/services/slices/jobSeekerSlice";
import { useParams } from "react-router-dom";
import filesTypes from "@/lib/filesTypes";
import { Button } from "../ui/button";
import SvgEye from "@/assets/svgs/SvgEye";
import clsx from "clsx";
import fileUploadTypes from "@/types/upload-s3-types";
import { useGetJobSeekerResumeListQuery } from "@/services/slices/adminSlice";

type ApplyJobUploadResumeProps = {
  type: fileUploadTypes;
  setFileData?: Dispatch<SetStateAction<any>>;
  coverError?: boolean;
  setResumeUploadId?: (id: string | undefined) => void;
  bigSize?: boolean;
};

const ApplyJobUploadResume: React.FC<ApplyJobUploadResumeProps> = ({
  type,
  setFileData,
  coverError,
  setResumeUploadId,
  bigSize,
}) => {
  const [error, setError] = useState<string>("");
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadData, setUploadData] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { refetch } = useGetJobSeekerResumeQuery();
  const { refetch : ResumeListRefetch } = useGetJobSeekerResumeListQuery();
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
    multiple: false,
    disabled: isUploading,
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

  // Handle preview
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  // Fake progress handler (replace with real progress if UploadToS3 supports it)
  const simulateProgress = () => {
    let value = 0;
    const interval = setInterval(() => {
      value += 10;
      setProgress(value);
      if (value >= 100) clearInterval(interval);
    }, 150);
  };

  // Upload file automatically when selected
  useEffect(() => {
    if (!file) return;

    if (type === "coverLetter") {
      if (setFileData) setFileData(file);
      return;
    }

    let cancelled = false;

    const doUpload = async () => {
      setError("");
      setIsUploading(true);
      setProgress(0);
      setUploadSuccess(false);
      setUploadData(null);

      simulateProgress();

      try {
        const result = await UploadToS3({ file, type, postId: id });

        if (cancelled) return;

        setUploadData(file.name);

        if (typeof result === "string" && setResumeUploadId) {
          setResumeUploadId(result);
        }

        setUploadSuccess(true);
      } catch (err) {
        if (!cancelled) {
          console.error("UploadToS3 error:", err);
          setError("Upload failed. Please try again.");
        }
      } finally {
        if (!cancelled) setIsUploading(false);
        refetch();
        ResumeListRefetch();
      }
    };

    doUpload();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return (
    <div className="ml-8 mt-5">
      {/* ✅ Uploaded file view */}
      {uploadData && type !== "defaultResume" ? (
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded border bg-slate-100 text-sm truncate max-w-[250px]">
            {uploadData}
          </div>

          {uploadSuccess && (
            <CheckCircle className="text-green-500 w-5 h-5" />
          )}

          {previewUrl && (
            <Button
              type="button"
              onClick={() => window.open(previewUrl, "_blank")}
              className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
            >
              <SvgEye />
            </Button>
          )}

          <Button
            type="button"
            onClick={() => {
              setUploadData(null);
              setResumeUploadId?.(undefined);
              setUploadSuccess(false);
            }}
            className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <Trash size={18} />
          </Button>
        </div>
      ) : (
        // ✅ Dropzone state
        <section className="container">
          <div
            {...getRootProps()}
            className={clsx(
              "border-2 border-dashed rounded p-6 text-center cursor-pointer w-[250px] transition-colors duration-200",
              isUploading && "opacity-50 pointer-events-none",
              coverError
                ? "border-red-500 bg-red-50"
                : isDragReject
                ? "border-red-500 bg-red-50"
                : isDragActive
                ? "border-blue-500 bg-blue-100"
                : "border-blue-200 bg-blue-50",
              bigSize && "w-[437px] h-[176px]"
            )}
          >
            <input {...getInputProps({ disabled: isUploading })} />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <LoadingSpinner className="w-5 h-5 mb-2" />
                <p className="text-sm">Uploading... {progress}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm font-medium">
                <Upload size={16} /> Upload Resume
              </div>
            )}
            <p
              className={clsx(
                "text-gray-600 mt-5",
                bigSize ? "text-sm w-[198px] mx-auto" : "text-xs"
              )}
            >
              {filesTypes.friendlyAllowed} · Max 10MB
            </p>
          </div>

          {!!(rejections.length || fileRejections.length) && (
            <aside className="mt-3">
              <h4 className="text-sm font-medium text-red-600 mb-1">
                Rejected
              </h4>
              <ul className="list-disc ml-5 text-sm text-red-600">
                {(rejections.length ? rejections : fileRejections).map(
                  ({ file, errors }) => (
                    <li key={file.name}>
                      {file.name} —{" "}
                      {errors.map((e) => e.message).join(", ")}
                    </li>
                  )
                )}
              </ul>
            </aside>
          )}
        </section>
      )}

      {error && (
        <p className="text-[12px] mt-2 font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ApplyJobUploadResume;
