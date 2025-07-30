import Profile from '@/assets/SuperAdmin/user-profile.png'
import Calendar from '@/assets/SuperAdmin/calendar.svg'

const RecentApplicant = () => {
    return (
        <div className='w-full px-[24px] py-[36px] border border-bg-hr rounded-xl'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-[7px] items-center'>
                    <img src={Profile} className='rounded-full w-[48px] h-[48px]' alt="" />
                    <div className='text-[12px] space-y-[5px]'>
                        <p className='font-semibold text-[#000]'>Than Naung</p>
                        <p className='font-normal text-[#575757]'>Fronted Developer</p>
                    </div>
                </div>
                <div className='flex gap-[10px] text-[#575757] items-center'>
                    <img src={Calendar} alt="" />
                    <p className='text-[12px] font-medium'>2024-01-15</p>
                </div>
                <div className='w-[102px]'>
                    <button className='bg-[#0481EF] w-full py-[4px] text-[12px] font-semibold rounded-md text-[#FFFFFF] shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] hover:shadow-none'>View Resume</button>
                </div>

            </div>
        </div>
    );
}

export default RecentApplicant;
