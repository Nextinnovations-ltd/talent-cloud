import React from 'react'
import linearBg from '../../../assets/Employee/Frame 36553.png'
const JoinBanner = () => {
  return (
      <div       style={{
        backgroundImage: `url(${linearBg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
  
        width: '100%',
      }} className='flex flex-col items-center justify-center gap-4 md:gap-[32px] md:py-[98px] py-[39px] px-[24px]'>
          <h1 className='text-black text-[18px] md:text-[40px] font-[600] text-center leading-[34.2px ] md:leading-[76px] uppercase'>
          Ready to Work on International Projects?
          </h1>
          <p className='text-black text-[12px] md:text-[20px] font-[500] text-center leading-[20px] md:leading-[38px]'>
          Get matched with companies in Japan and beyond — from right here in Myanmar.
          </p>
      <button className='bg-[#0481EF] flex justify-center items-center gap-[10px] py-[10px] px-[24px] rounded-[30px] text-white text-[16px] font-[500] leading-[28px] h-[41px] md:h-[64px]'>
        Join Talent Cloud
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4.66927 11.3332L11.3359 4.6665" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M11.3359 11.3332V4.6665H4.66927" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
    </div>
  )
}

export default JoinBanner