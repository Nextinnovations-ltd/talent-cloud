import Deletesvg from "@/assets/deletesvg";
import Downloadsvg from "@/assets/downloadsvg";
import Filesvg from "@/assets/filesvg";
import Marksvg from "@/assets/marksvg";
import MenuDot from "@/assets/menuDot";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";
import { useDefaultJobSeekerResumeMutation, useGetJobSeekerResumeListQuery } from "@/services/slices/adminSlice";
import { ResumeTypeItem } from "@/types/admin-auth-slice";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { useState } from "react";
import useToast from '@/hooks/use-toast';

type ResumeItemProps = {
    item: ResumeTypeItem
}

const ResumeItem: React.FC<ResumeItemProps> = ({ item }) => {
    const resume_url = item?.resume_url;
    const [isDownloading, setIsDownloading] = useState(false);
    const [makeDeafult] = useDefaultJobSeekerResumeMutation();
    const { refetch } = useGetJobSeekerResumeListQuery();
    const { showNotification } = useToast();
    const fileName = resume_url ? resume_url.split("/").pop() || "resume.pdf" : "resume.pdf";

    const handleDefault = async (id: string | number) => {
        await makeDeafult({ id });
        refetch();
    };

    const handleDownloadCV = async () => {
        if (!resume_url) {
            showNotification({
                message: "No resume available for this applicant",
                type: "danger",
            });
            return;
        }

        try {
            setIsDownloading(true);
            const response = await fetch(resume_url);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${fileName || "resume"}.pdf`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showNotification({
                message: "Download started",
                type: "success",
            });
        } catch {
            showNotification({
                message: "Failed to download CV",
                type: "danger",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-[667px] flex items-start relative justify-between gap-4 rounded-[12px] border border-[#CBD5E1] p-[15px] h-[120px]">
        <div className="flex gap-4">
          <div className="mt-3 ">
            <Filesvg />
           
          </div>
      
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <h3 className="text-[24px] font-medium w-[200px] truncate">{fileName}</h3>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-black text-white p-3 rounded-sm text-[12px] font-medium
                  data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95
                  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
                  transition-all duration-200"
                >
                  <h3>{fileName}</h3>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
      
            <p className="text-[#575757] mt-[10px]">
              Resume last uploaded on {formatDate(item?.uploaded_at)}
            </p>
          </div>
      
          {item?.is_default && (
            <div className="mt-3 bg-[#D7EAFF] h-[25px] flex items-center justify-center px-2 rounded-md text-[12px]">
              Default
            </div>
          )}
        </div>
      
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="mt-3 cursor-pointer w-[50px] flex items-center justify-center"><MenuDot /></div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" alignOffset={-80} className="w-48 mt-3">
            <DropdownMenuItem
              onClick={() => handleDefault(item?.id)}
              className="cursor-pointer focus:bg-gray-100"
            >
              <Marksvg /> Default
            </DropdownMenuItem>
      
            <DropdownMenuItem
              onClick={handleDownloadCV}
              className="cursor-pointer focus:bg-gray-100 flex items-center gap-2"
              disabled={isDownloading}
            >
              <Downloadsvg />
              {isDownloading ? (
                <span className="animate-pulse text-gray-500">Downloading...</span>
              ) : (
                "Download"
              )}
            </DropdownMenuItem>
      
            <DropdownMenuItem
              className="cursor-pointer text-[#E50914] focus:bg-gray-100"
            >
              <Deletesvg /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {isDownloading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full">
                <span className="animate-spin border-2 border-gray-300 border-t-gray-500 rounded-full w-5 h-5"></span>
              </div>
            )}
      </div>
      
    )
}

export default ResumeItem;
