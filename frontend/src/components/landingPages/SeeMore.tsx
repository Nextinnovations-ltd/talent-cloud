import React, { useState } from 'react'
import arrowIncrease from '../../assets/JobPortal/streamline_graph-arrow-increase.svg'
const SeeMore = () => {
    const [showmore, setShowMore] = useState(false);  
  return (
      <div className='bg-[#F7F7F7] pr-[20px] pl-[20px]'>
          <div className="max-w-[1240px] mx-auto flex lg:flex-row flex-col justify-between items-start pt-[119px] pb-[36px] bg-[#F7F7F7] gap-[64px]">
              <div className="md:max-w-[772px] max-w-full">
            
                  <h1 className='text-[16px] md:text-[32px] leading-[35px]  md:leading-[48px] font-[500] text-[#0481EF]'>
                  Talent Cloud — Your Myanmar EOR partner for hiring top developers and designers, no local entity needed.
                  </h1>
                  
                  <p className="text-[12px] md:text-[20px] leading-[27px] md:leading-[39px] font-[500] text-[#403E3E] mt-[20px] md:mt-[40px] mb-[25px]">
                  Talent Cloud is a trusted Employer of Record (EOR) platform in Myanmar, designed to help global companies hire top IT professionals.
  
                  <span
                    className={`block transition-all duration-500 ease-in-out overflow-hidden ${
                      showmore ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    —from skilled developers to world-class designers—with full compliance and HR support. We handle legal employment, payroll, and workplace setup, so you can focus on scaling with the best talent from Myanmar.
                  </span>
                </p>

 
                <button
                  className="relative bg-black rounded-[16px] w-[124px] md:w-[140px] md:h-[47px] h-[40px] text-white text-[12px] md:text-[16px] font-[500] leading-[14px] md:leading-[39px] overflow-hidden group"
                  onClick={() => setShowMore(!showmore)}
                >
                  {/* Top text (current state) */}
                  <span className="block relative z-10 transition-transform duration-300 group-hover:-translate-y-[47px]">
                    {showmore ? 'Show less' : 'See more'}
                  </span>

                  {/* Bottom text (next state) */}
                  <span className="block absolute top-full left-0 w-full text-white transition-transform duration-300 group-hover:-translate-y-[45px] z-0">
                    {showmore ? 'Show less' : 'See more'}
                  </span>
                </button>

              </div>
              <div className="hidden md:flex flex-col justify-between gap-[90px]">
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