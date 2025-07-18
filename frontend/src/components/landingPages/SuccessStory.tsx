import React from 'react'
import successStoryImage from '../../assets/JobPortal/Rectangle 5605.png' // Replace with actual image path
const SuccessStory = () => {
    const gradientStyle = {
        background: "linear-gradient(95deg, #FF7F00 20.11%, #FF037E 81.4%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text", // for Firefox
        color: "transparent",
      };
    return (
      <div className="bg-[#E8F1FC]">
           <div className='max-w-[1240px] mx-auto pt-[83px] pb-[139px] '>
              <p className='text-[20px] font-[500] leading-[31px]'>Success Story</p>
              <div className="flex justify-between items-center">
                  <h1 className='max-w-[524px] text-[40px] leading-[51px] font-[500] mb-4'>
                  ENGINNERFORCE SCALES EFFICIENTY  IN MYANMAR WITH EOR SERVICES
                  </h1>
                  <p className='max-w-[665px] text-[16px] leading-[32px] font-[500] text-black'>
                  Client: <span className=' text-[16px] leading-[32px] font-[500] text-[#0481EF]'>Engineerforce Inc</span>. – Tokyo, Japan Industry: Software Development and System Integrator (SIer)<span className=' text-[16px] leading-[32px] font-[500] text-[#0481EF]'>Provided EOR Services</span>: HR Support, Payroll, Legal Compliance, Workplace, <span className=' text-[16px] leading-[32px] font-[500] text-[#0481EF]'>Assets Roles </span>Hired: Software Engineers, Developers (Python, Django, React, Ruby)
                  </p>
              </div>
              <div className="flex justify-between items-center mt-[168px]">
                  <img src={successStoryImage} alt=""/>
                  <div className="flex flex-col  gap-[48px] max-w-[675px]">
                      <p className='text-[24px] font-[500] leading-[40px]'>What They Say About Us</p>
                      <p className='text-[24px] font-[500] leading-[40px]'>
                      “We highly recommend <span  style={gradientStyle}>Next Innovations</span> to companies seeking a comprehensive and effective solution to our recruitment need. “
                      </p>
                      <p className='text-[24px] font-[500] leading-[40px] '>
                          <span className='text-[#0481EF]'>Iida-san, CEO, Engineerforce Inc</span>. </p>
                  </div>
              </div>
        </div>
      </div>
   
  )
}

export default SuccessStory