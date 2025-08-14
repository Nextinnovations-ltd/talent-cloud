import React from 'react'
import linearBg from '../../../assets/Employee/Frame 36553.png'
import CommonButton from '../commonBtn/button'
const JoinBanner = () => {
  return (
      <div  style={{
        backgroundImage: `url(${linearBg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
  
        width: '100%',
      }} className='flex flex-col items-center justify-center gap-4 md:gap-[32px] md:py-[98px] py-[39px] px-[24px]'>
          <h1 className='text-black text-[18px] md:text-[40px] font-[600] text-center leading-[34.2px] md:leading-[76px] uppercase'>
          Ready to Work on International Projects?
          </h1>
          <p className='text-black text-[12px] md:text-[20px] font-[500] text-center leading-[20px] md:leading-[38px]'>
          Get matched with companies in Japan and beyond — from right here in Myanmar.
          </p>
       <CommonButton title='Join Talent Cloud' url='/'/>
    </div>
  )
}

export default JoinBanner