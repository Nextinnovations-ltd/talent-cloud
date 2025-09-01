import UserIcon from '@/assets/SuperAdmin/users.svg';
import EyeIcon from '@/assets/SuperAdmin/eye.svg';
import { JobPost } from '@/types/admin-auth-slice';
import { useNavigate } from 'react-router-dom';



interface RecentJobCardProps {
  data?: JobPost;
}

const RecentJobCard = ({ data }: RecentJobCardProps) => {
  // Format the posted date to relative time (e.g., "2 days ago")
  const formatPostedDate = (isoDate?: string) => {
    if (!isoDate) return 'Recently';
    
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);


   
    
    // Calculate time differences
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'Just now';
  };

  // Default values if data is not provided
  const jobTitle = data?.title || 'Backend Developer';
  const specialization = data?.specialization_name || 'Development';
  const company = data?.company || 'Next Innovations';
  const postedDate = formatPostedDate(data?.posted_date) || 'Recently';
  const applicantCount = data?.applicant_count ?? 23;
  const viewCount = data?.view_count ?? 1236;

  const navigate = useNavigate();

  return (
    <div className='w-full px-[24px] py-[18px] rounded-xl border border-bg-hr'>
      <div className='flex justify-between items-center'>
        <div className='space-y-[12px]'>
          <h2 className='text-[16px] text-[#000] font-semibold  w-[300px] line-clamp-1'>{jobTitle}</h2>
          
          <div className='flex gap-[32px] justify-center items-center text-[#575757] text-[12px] font-normal'>
            <p>{specialization}</p>
            <p>{company}</p>
            <p>{postedDate}</p>
          </div>
          
          <div className='flex gap-[57px] items-center'>
            <div className='flex gap-[8px] items-center text-[12px] font-normal'>
              <img src={UserIcon} alt="Applicants icon" />
              <p className='text-[#0481EF]'>{applicantCount} Applicants</p>
            </div>
            
            <div className='flex gap-[8px] items-center text-[12px] font-normal'>
              <img src={EyeIcon} alt="Views icon" />
              <p className='text-[#0481EF]'>{viewCount} views</p>
            </div>
          </div>
        </div>

        <div className='w-[102px]'>
        <button onClick={() => {navigate(`/admin/dashboard/allJobs/${data?.id}`)}} className='bg-white w-full rounded-[12px] border border-[#CBD5E1] p-[10px] text-[12px] font-semibold  text-blue-500   hover:shadow-md duration-300'>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentJobCard;