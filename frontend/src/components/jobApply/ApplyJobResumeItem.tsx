/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from 'sonner';

type ResumeDataType = {
    resume_url: string;
    resume_uploaded_time: string;
};

type ApplyJobResumeItemProps = {
    isLoading: boolean;
    ResumeData?: ResumeDataType | null;
};

const ApplyJobResumeItem: React.FC<ApplyJobResumeItemProps> = ({
    isLoading,
    ResumeData,
}) => {

    const [isDownloading, setIsDownloading] = useState(false);

    if (isLoading) {
        return (
            <div className="flex items-center mt-[30px] gap-5">
                <div className="h-[51px] w-60 rounded bg-gray-200 animate-pulse" />
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            </div>
        );
    }

    if (!ResumeData) {
        return (
            <div className="mt-[30px] text-sm text-gray-600">
                No resume available.
            </div>
        );
    }

    const { resume_url, resume_uploaded_time } = ResumeData;

    let formattedDate = "";
    try {
        formattedDate = format(new Date(resume_uploaded_time), "dd/MM/yyyy");
    } catch (e) {
        formattedDate = "";
    }

    const fileName = resume_url ? resume_url.split("/").pop() || "resume.pdf" : "resume.pdf";

    const handleView = () => {
        if (!resume_url) return;
        window.open(resume_url, "_blank");
    };

   

    const handleDownload = async () => {
        if (!resume_url) return;
        setIsDownloading(true);
        try {
            await toast.promise(
                (async () => {
                    const res = await fetch(resume_url, { mode: "cors" });
                    if (!res.ok) {
                        window.open(resume_url, "_blank", "noopener,noreferrer");
                        return;
                    }

                    const blob = await res.blob();
                    const objectUrl = URL.createObjectURL(blob);

                    const a = document.createElement("a");
                    a.href = objectUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    // Also open preview
                    window.open(objectUrl, "_blank", "noopener,noreferrer");

                    setTimeout(() => {
                        URL.revokeObjectURL(objectUrl);
                    }, 1000 * 10);
                })(),
                { loading: 'Downloading resume…', success: 'Download started', error: 'Failed to download resume' }
            );
        } catch (err) {
            console.error("Download failed, falling back to open in new tab:", err);
            window.open(resume_url, "_blank", "noopener,noreferrer");
        } finally {
            setIsDownloading(false);
        }
    };



    return (
        <div className="flex items-center mt-[30px] gap-5">
            <Button className="h-[51px] px-4 flex items-center justify-between shadow-none border font-normal border-slate-300 bg-slate-100 gap-3">
                {formattedDate && (
                    <span className="text-sm font-medium text-gray-600">{formattedDate}</span>
                )}
                <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
                    {fileName}
                </span>
            </Button>


            <Button
                onClick={handleView}
                className="w-[48px] hover:bg-gray-300 flex items-center justify-center h-[48px] rounded-full bg-gray-200"
                aria-label={`View ${fileName}`}
            >
                <Eye size={18} />
            </Button>

            <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-[48px] hover:bg-gray-300 flex items-center justify-center h-[48px] rounded-full bg-gray-200"
                aria-label={`Download ${fileName}`}
            >
                {isDownloading ? <span className="text-xs">...</span> : <Download size={18} />}
            </Button>
        </div>
    );
};

export default ApplyJobResumeItem;
