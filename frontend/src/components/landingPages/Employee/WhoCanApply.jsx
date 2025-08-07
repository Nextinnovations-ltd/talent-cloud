import React from 'react'
import designerImg from '../../../assets/Employee/Illustrator Drawing With Ipad 4.png';
import frontendDeveloperImg from '../../../assets/Employee/Modular Coding 1.png';
import backendDeveloperImg from '../../../assets/Employee/Coding 1.png';     
import QAImg from '../../../assets/Employee/Business Presentation 1.png'

const WhoCanApply = () => {
  return (
      <div className="max-w-[1240px] mx-auto pt-[48px] pb-[48px] md:pt-[67px] md:pb-[92px] flex flex-col items-center justify-center gap-6 lg:gap-12 pr-[24px] pl-[24px]">
    
    <h1 className="text-black text-[20px] md:text-[40px] font-[600] text-center">
    WHO CAN APPLY?
          </h1>
          <div className="w-full md:w-[80%] lg:w-full   grid grid-cols-2 gap-4 lg:flex items-center justify-between">
              <div className="">
                  <img src={designerImg} alt="" className='mx-auto' />
                  <p className='text-[16px] md:text-[24px] text-center font-[500]'>UI UX Designer</p>
              </div>
              <div className="">
                  <img src={frontendDeveloperImg} alt="" className='mx-auto' />
                  <p className='text-[16px] md:text-[24px] text-center font-[500]'>Frontend Developer</p>
              </div>
              <div className="">
                  <img src={backendDeveloperImg} alt="" className='mx-auto' />
                  <p className='text-[16px] md:text-[24px] text-center font-[500]'>Backend Developer</p>
              </div>
              <div className="">
                  <img src={QAImg} alt="" className='mx-auto' />
                  <p className='text-[16px] md:text-[24px] text-center font-[500]'>QA Engineer</p>
              </div>
          </div>
          

    </div>
  )
}

export default WhoCanApply