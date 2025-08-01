import Calendar from '@/assets/SuperAdmin/calendar.svg'

interface ApplicantData {
  applicant_id: number;
  name: string;
  email: string;
  role: string | null;
  profile_image_url: string;
  // Add other properties as needed
}

interface RecentApplicantProps {
  data?: ApplicantData;
}

const RecentApplicant = ({ data }: RecentApplicantProps) => {
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

  return (
    <div className='w-full px-[24px] py-[36px] border border-bg-hr rounded-xl'>
      <div className='flex justify-between items-center'>
        <div className='flex gap-[7px] items-center'>
          <img 
            src={data.profile_image_url} 
            className='rounded-full w-[48px] h-[48px] object-cover' 
            alt={data.name} 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/path/to/default/image.png';
            }}
          />
          <div className='text-[12px] space-y-[5px]'>
            <p className='font-semibold text-[#000]'>{data.name}</p>
            <p className='font-normal text-[#575757]'>
              {data.role || 'Role not specified'}
            </p>
          </div>
        </div>
        <div className='flex gap-[10px] text-[#575757] items-center'>
          <img src={Calendar} alt="Calendar icon" />
          {/* You might want to add an actual date field from your data */}
          <p className='text-[12px] font-medium'>Recent</p>
        </div>
        <div className='w-[102px]'>
          <button className='bg-[#0481EF] w-full py-[4px] text-[12px] font-semibold rounded-md text-[#FFFFFF] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] hover:shadow-none'>
            View Resume
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecentApplicant;