
import profile1 from '../../../assets/JobPortal/Ellipse 1117.png'
import profile2 from '../../../assets/JobPortal/Mask group.png'
import { motion } from "framer-motion";

const SuccessStory = () => {
   
    return (
  <div className="bg-[#E8F1FC] pl-5 pr-5">
    <motion.div
      className="max-w-[1240px] mx-auto pt-[53px] md:pt-[83px] pb-[30px] md:pb-[139px]"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <p className="text-[14px] md:text-[20px] font-[500] leading-[31px] mb-4">
        Success Story
      </p>

      {/* Heading + Description */}
      <motion.div
        className="flex md:flex-row flex-col justify-between items-start"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h1 className="max-w-full md:max-w-[524px] text-[24px] md:text-[40px] leading-[38px] md:leading-[51px] font-[500] mb-4">
          ENGINEERFORCE SCALES EFFICIENTY IN MYANMAR WITH EOR SERVICES
        </h1>
        <p className="max-w-full md:max-w-[665px] text-[12px] md:text-[16px] leading-[26px] md:leading-[32px] font-[500] text-black">
          <span className="text-[#0481EF]"> Client:</span> Engineerforce Inc. – Tokyo, Japan
          <br />
          <span className="text-[#0481EF]"> Industry:</span> Software Development and System Integrator (SIer)
          <br />
          <span className="text-[#0481EF]"> Provided EOR Services:</span> HR Support, Payroll, Legal Compliance, Workplace
          <br />
          <span className="text-[#0481EF]"> Assets Roles Hired:</span> Software Engineers, Developers (Python, Django, React, Ruby)
        </p>
      </motion.div>

      {/* Two White Cards */}
      <div className="flex flex-col md:flex-row max-w-[1240px] mx-auto gap-[48px] justify-center items-center mt-[116px]">
        {/* Card 1 */}
        <motion.div
          className="max-w-[597px] w-full md:w-[50%] bg-white rounded-[16px] px-[20px] py-[40px] md:p-[59px]"
          initial={{ opacity: 0, rotate: -6, y: 50 }}
          whileInView={{ opacity: 1, rotate: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img src={profile1} alt="" className="w-[80px] h-[80px] md:w-[112px] md:h-[112px]" />
          <p className="text-black text-[18px] md:text-[24px] font-[500] leading-[32px] md:leading-[40px] mt-[16px] md:mt-[32px]">
            “We highly recommend <span className="text-[#0481EF]">Talent Cloud</span> to companies seeking a comprehensive and effective solution to our recruitment need.”
          </p>
          <div className="flex flex-col gap-4 max-w-[457px] mt-[32px] md:mt-[48px] pl-3 md:pl-5">
            <p className="satisfy-font">Iida-san</p>
            <p className="md:text-[20px] text-[16px] font-[500] leading-[32px] md:leading-[40px] text-black">
              CEO of Engineerforce Inc
            </p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          className="max-w-[597px] w-full md:w-[50%] bg-white rounded-[16px] px-[20px] py-[40px] md:px-[50px] md:py-[59px]"
          initial={{ opacity: 0, rotate: 6, y: 50 }}
          whileInView={{ opacity: 1, rotate: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <img src={profile2} alt="" className="w-[80px] h-[80px] md:w-[112px] md:h-[112px]" />
          <p className="text-black text-[18px] md:text-[24px] font-[500] leading-[32px] md:leading-[40px] mt-[16px] md:mt-[32px]">
            “I started as a Junior Developer and now lead an engineering team. Their seamless support and genuine care have been one the keys to my growth.”
          </p>
          <div className="flex flex-col gap-4 max-w-[457px] mt-[32px] md:mt-[48px] pl-3 md:pl-5">
            <p className="satisfy-font">Min Min Latt</p>
            <p className="md:text-[20px] text-[16px] font-[500] leading-[32px] md:leading-[40px] text-black">
              CTO of Engineerforce Inc
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
   
  )
}

export default SuccessStory