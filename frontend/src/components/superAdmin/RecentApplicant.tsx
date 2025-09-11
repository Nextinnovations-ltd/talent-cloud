import Calendar from '@/assets/SuperAdmin/calendar.svg'
import { Applicant } from '@/types/admin-auth-slice';
import DEFAULT from '@/assets/ProfileNoData.png';
import { useNavigate } from 'react-router-dom';

const RecentApplicant = ({ data }: { data?: Applicant }) => {
  const navigate = useNavigate();
  // Fallback values if data is not provided


  if (!data) {
    return (
      <div className='w-full px-[24px] py-[36px] border border-bg-hr rounded-xl'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-[7px] items-center'>
            <div className='rounded-full w-[48px] h-[48px] bg-gray-200' />
            <div className='text-[12px] space-y-[5px]'>
              <p className='font-semibold text-[#000]'>No applicant</p>
              <p className='font-normal text-[#575757]'>No role</p>
            </div>
          </div>
          <div className='flex gap-[10px] text-[#575757] items-center'>
            <img src={Calendar} alt="" />
            <p className='text-[12px] font-medium'>No date</p>
          </div>
          <div className='w-[102px]'>
            <button className='bg-gray-300 w-full py-[4px] text-[12px] font-semibold rounded-md text-[#FFFFFF] cursor-not-allowed'>
              No Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format the applied date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className='w-full px-[24px] py-[36px] border border-bg-hr rounded-xl'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-[7px] items-center'>
          <img
            src={data.profile_image_url || DEFAULT}
            className='rounded-full w-[48px] h-[48px] object-cover'
            alt={data.name || 'Applicant'}
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT;
            }}
          />
          <div className='text-[12px] space-y-[5px]'>
            <p className='font-semibold  text-[#000] w-[150px] truncate'>{data.name || 'No name'}</p>
            <p className='font-normal text-[#575757]'>
              {data.role || 'Role not specified'}
            </p>
          </div>
        </div>
        <div className='flex gap-[10px] text-[#575757] items-center'>
          <img src={Calendar} alt="Calendar icon" />
          <p className='text-[12px] font-medium'>
            {data.applied_date ? formatDate(data.applied_date) : 'No date'}
          </p>
        </div>
        <div className='w-[102px]'>
          <button onClick={() => {
            navigate(`/admin/dashboard/allJobs/${data.job_post_id}`)
          }} className='bg-white w-full rounded-[12px] border border-[#CBD5E1] p-[10px] text-[12px] font-semibold  text-blue-500   hover:shadow-md duration-300'>
            View Job
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecentApplicant;