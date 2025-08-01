import Profile from "@/assets/SuperAdmin/user-profile.png";
import Phone from "@/assets/SuperAdmin/phone.svg";
import Location from "@/assets/SuperAdmin/location.svg";
import { Checkbox } from "@/components/ui/checkbox";

interface Applicant {
  applicant_id: number;
  name: string | null;
  phone_number: string | null;
  email: string;
  role: string | null;
  is_open_to_work: boolean;
  address: string | null;
  profile_image_url: string | null;
}

interface ApplicantsJobItemsProps {
  data: Applicant;
}

const ApplicantsJobItems = ({ data }: ApplicantsJobItemsProps) => {

    
  return (
    <tr className="h-[96px] border-b border-[#CBD5E1] align-middle">
    <td className="w-[5%] min-w-[40px] max-w-[60px] px-2 align-middle">
      <Checkbox className="w-5 mb-2 h-5 border border-[#CBD5E1] bg-[#FFF]" />
    </td>
  
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
          className={`w-[14px] h-[14px] rounded-full ${
            data.is_open_to_work ? "bg-[#29EA5F]" : "bg-[#EF4444]"
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
  </tr>
  
  );
};

export default ApplicantsJobItems;
