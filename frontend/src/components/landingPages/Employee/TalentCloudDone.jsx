import React from 'react'
import project1 from '../../../assets/Employee/image 94.png'
import project2 from '../../../assets/Employee/Frame 36359.png'
import project3 from '../../../assets/Employee/image 96.png'
import hoverCircle from '../../../assets/Employee/Frame 36337.png'
import './TalentCloud.css'
const TalentCloudDone = () => {
  return (
    <div className="bg-[#F7F7F7] pt-[52px] pb-[52px]">
    <div className='mx-auto max-w-[1240px] mt-[34px]'>
      <h1 className='text-black text-[40px] font-[600] text-center mb-[48px]'>  WHAT OUR TALENT DONE ?</h1>
      <div className="flex gap-[13px] justify-center items-center">
          <div className="img-container w-[50%]">
            <img src={project1} alt="" className=' w-full' />
            <div className='hover-img flex flex-col justify-center items-start px-[20px]'>
              <h1 className='text-white text-[25.82px] font-[600]'>LocaBoo – Web Print Service</h1>
              <p className='text-white text-[19.365px] font-[600] leading-[32px] mt-[10px]'>Supported frontend and backend development for a large-scale Japanese web-to-print platform. <br />
              Used: JavaScript, Laravel  Role: Full-stack Developer
             </p>
              <button className='text-white text-[12px] font-[600] leading-[21.48px ] mt-[16px] underline py-[10px] px-[12px] rounded-[6px] bg-[#FFFFFF3D]'>Visit site</button>
           </div>
        </div>
          <div className="img-container w-[50%]">
            <img src={project2} alt="" className=' w-full' />
            <div className='hover-img flex flex-col justify-center items-start px-[20px]'>
              <h1 className='text-white text-[25.82px] font-[600]'>KG Motors, Sale Order Project</h1>
              <p className='text-white text-[19.365px] font-[600] leading-[32px] mt-[10px]'>Built and migrated backend infrastructure using
                <br></br>AWS Cloud Formation and Terraform. <br></br>
                Used: PHP, Laravel    Role: Backend, DevOps</p>
              <button className='text-white text-[12px] font-[600] leading-[21.48px ] mt-[16px] underline py-[10px] px-[12px] rounded-[6px] bg-[#FFFFFF3D]'>Visit site</button>
            </div>
        </div>
        
          
        </div>
        <div className="bg-white px-[78px] py-[48px] flex justify-between items-center mt-8 rounded-[16px]">
          <div className="max-w-[456px] flex flex-col gap-[37px]">
            <h1 className='text-[#000] text-[20px] font-[600] '>Project overviews</h1>
            <p className='text-[#575757] text-[16px] font-[500] '>
            Backend Engineer, DevOps Engineer Remote — 2025 – Present
              • AI Agent: Built a custom SDK to abstract and extend integration with Dify (an open-
              source LLMOps platform), which was later integrated into a Django backend.
              • DevOps: Deployed backend services using AWS ECS Fargate (Serverless) and auto-
              mated provisioning and deployment via GitHub Actions.
            </p>
            <div className="max-w-[331px] flex justify-between ">
              <p className='text-[16px] font-[500]'>Team member</p>
              <p className='text-[16px] font-[500]'>Language</p>
            </div>
          </div>
        <img src={project3} alt="" />
        </div>
      </div>
      </div>
  )
}

export default TalentCloudDone