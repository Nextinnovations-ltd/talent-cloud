import { motion } from "framer-motion";
import CTOImg from '../../../assets/Employee/Rectangle 5676.png'
import arrowRight from '../../../assets/Employee/arrow-right.svg'

const TalentCloudSay = () => {
  return (
    <div className='max-w-[1240px] mx-auto mt-[67px] mb-6 md:mb-[67px] flex flex-col gap-[24px] md:gap-[48px] items-center justify-center pl-6 pr-6'>
      
      {/* Section Title */}
      <motion.h1
        className='text-black text-[20px] md:text-[40px] font-[600]'
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        WHAT OUR TALENT SAY ?
      </motion.h1>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-[24px] md:gap-[73px] justify-center items-center">

        {/* Image */}
        <motion.img
          src={CTOImg}
          alt=""
          className='max-w-full md:max-w-[498px]'
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        {/* Text */}
        <motion.div
          className="md:pt-4 md:pb-4"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h1 className='text-[19px] md:text-[32px] font-[600] leading-[30.553px ] md:leading-[51px] mb-[24px] md:mb-[32px]'>
            Min Min Latt, CTO, Engineerforce Inc
          </h1>
          <p className='text-[#484747] text-[14px] md:text-[20px] font-[600] leading-[23px] md:leading-[34px] mb-[10px] md:mb-[48px]'>
            I began my career as a Junior Developer through their EOR service, and today, I lead an engineering team.
            From the very start, their onboarding, payroll, and support were seamless and professional.
            More than just a service provider, they’ve been a part of my growth journey.
            Their commitment to care and excellence is raising the bar for EOR services in Myanmar.
          </p>
          <div className="flex items-center gap-1 md:gap-6">
            <a href="" className='text-black text-[12px] md:text-[20px] font-[600] leading-[18px] md:leading-[31px] underline'>
              GET TO KNOW MORE
            </a>
            <img src={arrowRight} alt="" className='w-[20px] md:w-[24px] h-[20px] md:h-[24px]' />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TalentCloudSay;
