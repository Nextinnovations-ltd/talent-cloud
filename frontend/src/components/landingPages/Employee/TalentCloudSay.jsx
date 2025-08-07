import React from 'react'
import CTOImg from '../../../assets/Employee/Rectangle 5676.png'
import arrowRight from '../../../assets/Employee/arrow-right.svg'
const TalentCloudSay = () => {
  return (
      <div className='max-w-[1240px] mx-auto mt-[67px] mb-[67px] flex flex-col gap-[48px] items-center justify-center'>
          <h1 className='text-black text-[40px] font-[600] '>  WHAT OUR TALENT SAY ?</h1>
          <div className="flex gap-[73px] justify-center items-center">
              <img src={CTOImg} alt="" />
              <div className="pt-4 pb-4 ">
                  <h1 className='text-[32px] font-[600] leading-[51px] mb-[32px]'>Min Min Latt, CTO, Engineerforce Inc
                  </h1>
                  <p className='text-[#484747] text-[20px] font-[600] leading-[34px] mb-[48px]'>
                  I began my career as a Junior Developer through their EOR service, and today, I lead an engineering team.
                    From the very start, their onboarding, payroll, and support were seamless and professional.
                    More than just a service provider, they’ve been a part of my growth journey.
Their commitment to care and excellence is raising the bar for EOR services in Myanmar.
                  </p>
                  <div className="flex gap-6">
                  <a href="" className='text-black text-[20px] font-[600] leading-[31px] underline'>
                  GET TO KNOW MORE
                  </a>
                  <img src={arrowRight} alt="" />
             </div>
              </div>
          </div>
    </div>
  )
}

export default TalentCloudSay