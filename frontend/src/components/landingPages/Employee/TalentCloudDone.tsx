import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import project1 from '../../../assets/Employee/image 94.png';
import project2 from '../../../assets/Employee/Frame 36359.png';
import project3 from '../../../assets/Employee/image 96.png';
import './TalentCloud.css';

// Wrap Link for motion
const MotionLink = motion(Link);

const TalentCloudDone = () => {
  return (
    <div className="bg-[#F7F7F7] pt-[52px] pb-[52px]">
      <div className='mx-auto max-w-[1240px] mt-[34px] pl-6 pr-6'>
        <h1 className='text-black text-[20px] md:text-[40px] font-[600] text-center mb-[24px] md:mb-[48px]'>
          WHAT OUR TALENT DONE ?
        </h1>

        {/* Top projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[13px] justify-center items-start">
          {/* Project 1 */}
          <MotionLink
            to='http://staging.locaboo.jp/'
            target="_blank"
            className="img-container w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <img src={project1} alt="LocaBoo" className='w-full' />
              <div className='hover-img flex flex-col justify-center items-start px-[20px]'>
                <h1 className='text-white text-[16px] md:text-[25.82px] font-[600]'>
                  LocaBoo – Web Print Service
                </h1>
                <p className='text-white text-[12px] md:text-[19.365px] font-[600] leading-[20px] md:leading-[32px] mt-[5px] md:mt-[10px]'>
                  Supported frontend and backend development for a large-scale Japanese web-to-print platform. <br />
                  Used: JavaScript, Laravel <br/>
                  Role: Full-stack Developer
                </p>
                <a href="https://hosono.ai/ja" target="_blank" className='text-white text-[12px] font-[600] leading-[21.48px] mt-[10px] md:mt-[16px] underline py-[10px] px-[12px] rounded-[6px] bg-[#FFFFFF3D] hover:bg-black transition-all duration-300'>
                  Visit site
                </a>
              </div>
            </div>
          </MotionLink>

          {/* Project 2 */}
          <MotionLink
            to='https://kg-m.jp/'
            target="_blank"
            className="img-container w-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <img src={project2} alt="KG Motors" className='w-full' />
              <div className='hover-img flex flex-col justify-center items-start px-[20px]'>
                <h1 className='text-white text-[16px] md:text-[25.82px] font-[600]'>
                  KG Motors, Sale Order Project
                </h1>
                <p className='text-white text-[12px] md:text-[19.365px] font-[600] leading-[20px] md:leading-[32px] mt-[5px] md:mt-[10px]'>
                  Built and migrated backend infrastructure using AWS Cloud Formation and Terraform. <br />
                  Used: PHP, Laravel <br/>
                  Role: Backend, DevOps
                </p>
                <a href="https://hosono.ai/ja" target="_blank" className='text-white text-[12px] font-[600] leading-[21.48px] mt-[10px] md:mt-[16px] underline py-[10px] px-[12px] rounded-[6px] bg-[#FFFFFF3D] hover:bg-black transition-all duration-300'>
                  Visit site
                </a>
              </div>
            </div>
          </MotionLink>
        </div>

        {/* Bottom project */}
        <div className="bg-white px-[24px] py-[24px] lg:px-[78px] lg:py-[48px] flex flex-col-reverse md:flex-row justify-between items-center gap-5 mt-8 rounded-[16px]">
          <div className="max-w-[456px] flex flex-col mb-0">
            <h1 className='text-[#000] text-[16px] md:text-[20px] font-[600]'>
              Project overviews
            </h1>
            <p className='text-[#575757] text-[14px] md:text-[16px] font-[500] mt-[24px] md:mt-[37px] mb-[24px] md:mb-[37px]'>
              Backend Engineer, DevOps Engineer Remote — 2025 – Present
              • AI Agent: Built a custom SDK to abstract and extend integration with Dify (an open-source LLMOps platform), later integrated into a Django backend.
              • DevOps: Deployed backend services using AWS ECS Fargate (Serverless) and automated provisioning and deployment via GitHub Actions.
            </p>
            <div className="flex flex-col gap-3 justify-center">
              <p className='text-[16px] md:text-[16px] font-[500]'>Used: Django, GitHub Actions, LLMOps</p>
              <p className='text-[16px] md:text-[16px] font-[500]'>Role: Backend, DevOps</p>
              <a href="https://hosono.ai/ja" target="_blank" className='text-[#0481EF] text-[12px] font-[600] leading-[21.48px] mt-[10px] md:mt-[16px] underline py-[10px] px-[12px] rounded-[6px] border border-[#767676] max-w-[80px] hover:border-[#0481EF] hover:bg-[#0481EF] hover:text-white transition-all duration-300'>
                Visit site
              </a>
            </div>
          </div>

          <MotionLink
            to='https://hosono.ai/ja'
            target="_blank"
            className='w-full md:w-[50%] lg:max-w-[447px]'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <img src={project3} alt="Hosono AI" className="w-full" />
          </MotionLink>
        </div>
      </div>
    </div>
  )
}

export default TalentCloudDone;
