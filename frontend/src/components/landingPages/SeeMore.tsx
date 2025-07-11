import React from 'react'
import arrowIncrease from '../../assets/JobPortal/streamline_graph-arrow-increase.svg'
const SeeMore = () => {
  return (
      <div className='bg-[#F7F7F7]'>
          <div className="max-w-[1240px] mx-auto flex justify-between items-center pt-[119px] pb-[36px] ">
              <div className="max-w-[772px] ">
            
                  <h1 className='text-[32px] leading-[48px] font-[500] text-[#0481EF]'>
                  Talent Cloud — Your Myanmar EOR partner for hiring top developers and designers, no local entity needed.
                  </h1>
                  
                  <p className='text-[20px] leading-[39px] font-[500] text-[#403E3E] mt-[40px] mb-[25px]'>
                  Talent Cloud is a trusted Employer of Record (EOR) platform in Myanmar, designed to help global companies hire top IT professional
                  </p>
                  <button className='bg-black rounded-[16px] w-[140px] h-[47px]  text-white text-[16px] font-[500] leading-[39px]'>See more</button>
              </div>
              <div className="flex flex-col justify-between gap-[90px]">
                  <div className="flex flex-col justify-center gap-4 items-center">
                      <div className="flex gap-2 justify-center items-start">
                          <h1 className='text-[40px] font-[500] leading-[28px]'>+100 </h1>
                          <img src={arrowIncrease} alt="" />
                      </div>
                      <p className='text-[#0481EF] text-[16px] font-[500] leading-7'>Position available</p>
                  </div>
                  <div className="flex flex-col justify-center gap-4 items-center">
                      <div className="flex gap-2 justify-center items-start">
                          <h1 className='text-[40px] font-[500] leading-[28px]'>+200 </h1>
                          <img src={arrowIncrease} alt="" />
                      </div>
                      <p className='text-[#0481EF] text-[16px] font-[500] leading-7'>Local Talent</p>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default SeeMore