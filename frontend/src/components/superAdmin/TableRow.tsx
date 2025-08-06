import Profile from "@/assets/SuperAdmin/user-profile.png";
import Phone from "@/assets/SuperAdmin/phone.svg";
import Location from "@/assets/SuperAdmin/location.svg";

import SvgMore from "@/assets/svgs/SvgMore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useShortListApplicantsMutation } from "@/services/slices/adminSlice";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { Applicant } from "@/types/admin-auth-slice";
import useToast from "@/hooks/use-toast";

interface ApplicantsJobItemsProps {
  data: Applicant;
}

const ApplicantsJobItems = ({ data }: ApplicantsJobItemsProps) => {

  const [shortListApplicant, { isLoading }] = useShortListApplicantsMutation();
  const { showNotification } = useToast();


  const handleAddToShortList = async () => {
    if (!data?.job_post_id || !data?.applicant_id) return;

    try {
     const response = await shortListApplicant({
        jobId: data.job_post_id,
        applicantId: data.applicant_id,
      }).unwrap();

      if (response?.status) {
        showNotification({
          message:response.message,
          type: "success",
        });
      }; 

    } catch (err) {
      console.error("Error shortlisting applicant:", err);
    }
  };
  return (
    <tr className="h-[96px] border-b border-[#CBD5E1] align-middle">

      <td className="w-[25%] min-w-[200px] max-w-[300px] px-2 align-middle">
        <div className="flex gap-2 items-center">
          <img
            src={data.profile_image_url ?? Profile}
            className="rounded-full w-12 h-12 object-cover"
            alt="profile"
          />
          <div className="text-[14px] space-y-1">
            <p className="font-semibold text-black">{data.name ?? "No Name"}</p>
            <p className="text-gray-600">{data.role ?? "Not specified"}</p>
          </div>
        </div>
      </td>

      <td className="w-[15%] min-w-[120px] max-w-[180px] px-2 align-middle">
        <div className="flex gap-2 text-gray-600 items-center">
          <img src={Phone} alt="phone" />
          <p className="text-[14px] font-medium">{data.phone_number ?? "N/A"}</p>
        </div>
      </td>

      <td className="w-[20%] min-w-[150px] max-w-[250px] px-2 align-middle">
        <div className="flex gap-2 text-gray-600 items-center">
          <img src={Location} alt="location" />
          <p className="text-[14px] font-medium">{data.address ?? "Not provided"}</p>
        </div>
      </td>

      <td className="w-[20%] min-w-[150px] max-w-[250px] px-2 align-middle">
        <div className="flex gap-2 text-gray-600 items-center">
          <div
            className={`w-[14px] h-[14px] rounded-full ${data.is_open_to_work ? "bg-[#29EA5F]" : "bg-[#EF4444]"
              }`}
          ></div>
          <p className=" text-[14px] font-medium">
            {data.is_open_to_work ? "Available for Work" : "Not Available"}
          </p>
        </div>
      </td>

      <td className="w-[15%] min-w-[100px] max-w-[150px] px-2 align-middle">
        <button className="bg-[#0481EF] w-full py-2 text-[14px] font-semibold rounded-md text-white shadow-sm hover:shadow-none">
          Download CV
        </button>
      </td>
      <td className="w-[5%] justify-center items-center min-w-[100px] max-w-[150px] px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-full flex items-center justify-center cursor-pointer">
              <SvgMore />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer" onSelect={handleAddToShortList}>
              {
                isLoading ? <LoadingSpinner/> : 'Add to shortlist '
              }
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>

    </tr>

  );
};

export default ApplicantsJobItems;
