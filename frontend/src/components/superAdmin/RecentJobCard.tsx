import UserIcon from '@/assets/SuperAdmin/users.svg';
import EyeIcon from '@/assets/SuperAdmin/eye.svg';


const RecentJobCard = () => {
    return (
        <div className='w-[568px] px-[24px] py-[18px] rounded-xl border border-bg-hr'>
            <div className='flex justify-between items-center'>
                <div className='space-y-[12px]'>
                    <h2 className='text-[16px] text-[#000] font-semibold'>Backend Developer</h2>
                    <div className='flex gap-[32px] justify-center items-center text-[#575757] text-[12px] font-normal'>
                        <p>Development</p>
                        <p>Next Innovations</p>
                        <p>2 days ago</p>
                    </div>
                    <div className='flex gap-[57px] items-center'>
                        <div className='flex gap-[8px] items-center text-[12px] font-normal'>
                            <img src={UserIcon} alt="" />
                            <p className='text-[#0481EF]'>23 Applicants</p>
                        </div>
                        <div className='flex gap-[8px] items-center text-[12px] font-normal'>
                            <img src={EyeIcon} alt="" />
                            <p className='text-[#0481EF]'>1236 views</p>
                        </div>
                    </div>
                </div>

                <div className='w-[102px]'>
                    <button className='bg-[#0481EF] w-full py-[4px] text-[12px] font-semibold rounded-md text-[#FFFFFF] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] hover:shadow-none'>View Details</button>
                </div>
            </div>
            
        </div>
    );
}

export default RecentJobCard;
