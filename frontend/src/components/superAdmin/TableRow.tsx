/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react';
import Profile from '@/assets/ProfileNoData.png';
import Phone from '@/assets/SuperAdmin/phone.svg';
import Location from '@/assets/SuperAdmin/location.svg';
import SvgMore from '@/assets/svgs/SvgMore';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useShortListApplicantsMutation } from '@/services/slices/adminSlice';
import { Applicant } from '@/types/admin-auth-slice';
import useToast from '@/hooks/use-toast';
import ConfirmationDialog from './ShortListDialog';
import { useNavigate } from "react-router-dom";


interface ApplicantsJobItemsProps {
  data: Applicant;
  isShortList: boolean
}

const ApplicantsJobItems = ({ data, isShortList = false }: ApplicantsJobItemsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shortListApplicant, { isLoading }] = useShortListApplicantsMutation();
  const { showNotification } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();



  const handleAddToShortList = async () => {
    if (!data?.job_post_id || !data?.applicant_id) return;

    try {
      const response = await shortListApplicant({
        jobId: data.job_post_id,
        applicantId: data.applicant_id,
      }).unwrap();

      showNotification({
        message: response?.message || 'Applicant shortlisted successfully',
        type: 'success',
      });
    } catch (err) {
      showNotification({
        //@ts-ignore
        message: err?.data?.message || 'Failed to shortlist applicant',
        type: 'danger',
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleUserDetail = () => {
    // Implement view profile logic
    navigate(`/admin/dashboard/candiates/profile/${data.applicant_id}`)
  };

  const handleDownloadCV = async () => {
    if (!data?.resume_url) {
      showNotification({
        message: "No resume available for this applicant",
        type: "danger",
      });
      return;
    }
  
    try {
      setIsDownloading(true);
      const response = await fetch(data.resume_url);
      const blob = await response.blob();
  
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data.name || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification({
        message: "Download started",
        type: "success",
      });
    } catch  {
      showNotification({
        message: "Failed to download CV",
        type: "danger",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  
  

  return (
    <>
      <tr className="h-[134px] border-b border-[#F2F2F2] align-middle">
        {/* Profile Column */}
        <td className="w-[25%] min-w-[200px] max-w-[300px] px-2 align-middle">
          <div className="flex gap-2 items-center">
            <img
              src={data.profile_image_url ?? Profile}
              className="rounded-full w-12 h-12 object-cover"
              alt="profile"
            />
            <div className="text-[14px] space-y-1">
              <p className="font-semibold text-black">{data.name || 'No Name'}</p>
              <p className="text-gray-600">{data.role || 'Not specified'}</p>
            </div>
          </div>
        </td>

        {/* Phone Column */}
        <td className="w-[15%] min-w-[120px] max-w-[180px] px-2 align-middle">
          <div className="flex gap-2 text-gray-600 items-center">
            <img src={Phone} alt="phone" className="w-4 h-4" />
            <p className="text-[14px] font-medium">{data.phone_number || 'N/A'}</p>
          </div>
        </td>

        {/* Location Column */}
        <td className="w-[20%] min-w-[150px] max-w-[250px] px-2 align-middle">
          <div className="flex gap-2 text-gray-600 items-center">
            <img src={Location} alt="location" className="w-4 h-4" />
            <p className="text-[14px] font-medium">{data.address || 'Not provided'}</p>
          </div>
        </td>

        {/* Availability Column */}
        <td className="w-[20%] min-w-[150px] max-w-[250px] px-2 align-middle">
          <div className="flex gap-2 text-gray-600 items-center">
            <div
              className={`w-[14px] h-[14px] rounded-full ${data.is_open_to_work ? 'bg-[#29EA5F]' : 'bg-[#EF4444]'
                }`}
            />
            <p className="text-[14px] font-medium">
              {data.is_open_to_work ? 'Available for Work' : 'unvailable'}
            </p>
          </div>
        </td>

       {/* Download CV Column */}
<td className="w-[15%] min-w-[100px] max-w-[150px] px-2 align-middle">
  {data?.resume_url ? (
    <button
      onClick={handleDownloadCV}
      disabled={isDownloading}
      aria-busy={isDownloading}
      className="bg-[#0481EF] px-[10px] py-2 text-[14px] font-semibold rounded-md text-white shadow-sm hover:shadow-none transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isDownloading ? 'Downloading…' : 'Download CV'}
    </button>
  ) : (
    <button
      disabled
      className="bg-gray-300 px-[10px] py-2 text-[14px] font-semibold rounded-md text-white shadow-sm cursor-not-allowed"
    >
      No CV
    </button>
  )}
</td>


        {/* Actions Column */}
        <td className="w-[5%] min-w-[100px] max-w-[150px] px-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex justify-center">
                <SvgMore />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
          
              {
                !isShortList && <DropdownMenuItem
                  onSelect={() => setIsDialogOpen(true)}
                  className="cursor-pointer focus:bg-gray-100"
                >
                  Add to shortlist
                </DropdownMenuItem>
              }
              <DropdownMenuItem
                onSelect={handleUserDetail}
                className="cursor-pointer focus:bg-gray-100"
              >
                View user profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleUserDetail}
                className="cursor-pointer focus:bg-gray-100"
              >
                Download Cover Letter
              </DropdownMenuItem>
            
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>

      <ConfirmationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleAddToShortList}
        isLoading={isLoading}
        title="Confirm Action"
        description="Are you sure you want to perform this action?"
      />
    </>
  );
};

export default ApplicantsJobItems;