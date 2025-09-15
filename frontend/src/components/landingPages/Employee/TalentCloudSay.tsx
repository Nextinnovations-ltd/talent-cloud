import { motion } from "framer-motion";
import CTOImg from '../../../assets/Employee/Rectangle 5676.png'
import arrowRight from '../../../assets/Employee/Group 26834.svg'
import { Link } from "react-router-dom";

const TalentCloudSay = () => {
  return (
    <div className="bg-[#F8F8F8] w-full">
    <div className='overflow-x-hidden max-w-[1240px] mx-auto pt-[67px] pb-6 md:pb-[67px] flex flex-col gap-[24px] md:gap-[48px] items-center justify-center pl-6 pr-6 '>
      
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
    {/*   <div className="flex flex-col md:flex-row gap-[24px] md:gap-[73px] justify-center items-center">


        <motion.img
          src={CTOImg}
          alt=""
          className='max-w-full md:max-w-[498px]'
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        />

      
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
      </div> */}
   

        {/* First Row */}
        <div className="flex flex-col md:flex-row gap-[24px] md:gap-[32px] justify-center items-center">
          {/* Image with left slide */}
          <motion.img
            src={CTOImg}
            alt=""
            className="max-w-full md:max-w-[373px] rounded-[26px]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />

          {/* Text Card with fade up */}
          <motion.div
            className="pt-4 pb-[40px] pl-[47px] pr-[17px] w-[765px] min-h-[359px] bg-white rounded-[26px]"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link to="" className="flex justify-end">
               <motion.img
                src={arrowRight}
                alt=""
                whileHover={{ x: 5, scale: 1.1 }} // move slightly right + scale up
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              />
            </Link>
            <p className="text-[#484747] text-[16px] font-[600] leading-[27px] mt-[7px] mb-[27px] text-center max-w-[571px]">
              “ I began my career as a Junior Developer through their EOR service, and
              today, I lead an engineering team. From the very start, their onboarding,
              payroll, and support were seamless and professional. More than just a
              service provider, they’ve been a part of my growth journey. Their
              commitment to care and excellence is raising the bar for EOR services in
              Myanmar. “
            </p>
            <h1 className="text-[20px] font-[500] leading-[32px]">
              Min Min Latt (CTO) Engineerforce Inc
            </h1>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="flex flex-col md:flex-row gap-[24px] md:gap-[32px] justify-center items-center w-full">
          {/* Left Card */}
          <motion.div
            className="pt-4 pb-[40px] pl-[35px] pr-[17px] w-[50%] min-h-[359px] bg-white rounded-[26px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link to="" className="flex justify-end">
               <motion.img
                src={arrowRight}
                alt=""
                whileHover={{ x: 5, scale: 1.1 }} // move slightly right + scale up
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              />
            </Link>
            <p className="text-[#484747] text-[16px] font-[600] leading-[27px] mt-[35px] text-center max-w-[462px]">
              “ I began my career as a Junior Developer through their EOR service, and
              today, I lead an engineering team. From the very start, their onboarding,
              payroll, and support were seamless and professional. “
            </p>
            <div className="flex items-center gap-6 mt-[80px]">
              <img
                src={CTOImg}
                alt=""
                className="w-[72px] h-[72px] object-cover rounded-full"
              />
              <div>
                <p className="text-[18px] font-[500] leading-[28px]">
                  Than Myo Htet (Backend Developer)
                </p>
                <p className="text-[20px] font-[500] leading-[32px]">
                  Engineerforce Inc
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Card */}
          <motion.div
            className="pt-4 pb-[40px] pl-[35px] pr-[17px] w-[50%] min-h-[359px] bg-white rounded-[26px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Link to="" className="flex justify-end">
               <motion.img
                src={arrowRight}
                alt=""
                whileHover={{ x: 5, scale: 1.1 }} // move slightly right + scale up
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              />
            </Link>
            <p className="text-[#484747] text-[16px] font-[600] leading-[27px] mt-[35px] text-center max-w-[462px]">
              “ I began my career as a Junior Developer through their EOR service, and
              today, I lead an engineering team. From the very start, their onboarding,
              payroll, and support were seamless and professional. “
            </p>
            <div className="flex items-center gap-6 mt-[80px]">
              <img
                src={CTOImg}
                alt=""
                className="w-[72px] h-[72px] object-cover rounded-full"
              />
              <div>
                <p className="text-[18px] font-[500] leading-[28px]">
                  Than Myo Htet (Backend Developer)
                </p>
                <p className="text-[20px] font-[500] leading-[32px]">
                  Engineerforce Inc
                </p>
              </div>
            </div>
          </motion.div>
        </div>

           
       
      </div>
  </div>
  )
}

export default TalentCloudSay;
