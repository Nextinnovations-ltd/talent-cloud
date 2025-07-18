import React from 'react'
import {motion} from 'framer-motion'
import teamwork from '../../assets/JobPortal/yong-group.png'
import icon1 from '../../assets/JobPortal/Frame 36106.svg'
import icon2 from '../../assets/JobPortal/Frame 36107.svg'
import icon3 from '../../assets/JobPortal/Frame 36109.svg'
import icon4 from '../../assets/JobPortal/Frame 36110.svg'
const ReasonToChoose = () => {
    return (
        <div className="bg-[#F9FAFB] mt-[96px]">
      <div className='max-w-[1240px] mx-auto pt-[83px] pb-[61px] '>
          <h1 className='text-[40px] leading-[57px] font-[600] mb-[81px]'>WHY CHOOSE TALENT CLOUD ?</h1>
          <div className="flex gap-[100px] justify-center ">
              <div className="pt-[28px]">
                  <img src={ teamwork} className='mb-[30px] ml-[49px]'/>
                  <p className='mb-[17px]'>The EOR service is already in operation.</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="373" height="41" viewBox="0 0 373 41" fill="none">
                            <motion.path
                            viewport={{ once: true }} 
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              transition={{ duration: 1, ease: "easeInOut" }}
                              d="M3.00001 6.63059C109.985 83.9052 95.9107 -23.1759 204.85 27.497C297.495 70.5907 252.291 -36.5477 370 19.7855"
                              stroke="#0481EF"
                              strokeOpacity="0.48"
                              strokeWidth="5.75447"
                              strokeLinecap="round"
                            />
               
                        </svg>
                    </div>
                    <div className="grid grid-cols-2 gap-[73px]">
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon1} alt="" className='w-[52px] h-[50px]'/>
                            <h1 className='text-[20px] leading-[48px] font-[600]'>Hire Without a Local Entity</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] text-[16px]'>No local entity needed—we act as your legal employer for a smooth, compliant hiring process.</p>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon3} alt="" className='w-[52px] h-[50px]'/>
                            <h1 className='text-[20px] leading-[48px] font-[600]'>Specialized in IT Talent</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] text-[16px]'>We find and manage top tech and creative talent to build your remote team with ease.</p>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon2} alt="" className='w-[52px] h-[50px]'/>
                            <h1 className='text-[20px] leading-[48px] font-[600]'>Full HR & Payroll Compliance</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] text-[16px]'>We manage salaries, benefits, and ensure full compliance with Myanmar labor laws—so you can hire with confidence.</p>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon4} alt="" className='w-[52px] h-[50px]'/>
                            <h1 className='text-[20px] leading-[48px] font-[600]'>Workplace & Equipment Support</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] text-[16px]'>We provide the tools your remote hire needs—from laptops to internet—for a smooth setup.</p>
                        </div>

                    </div>
                    
          </div>
            </div>
            </div>
  )
}

export default ReasonToChoose
