import getJobPromotionImg from '../../../assets/Employee/Get Job Promotion 1.png';
import jobInterviewImg from '../../../assets/Employee/Job Interview 2.png'
import brainstormImg from '../../../assets/Employee/Team Brainstorming 5.png';
import teamSuccessImg from '../../../assets/Employee/Team Success 3.png';
import { motion } from "framer-motion";
const WhyJoinTC = () => {
  return (
   <div
  id="why-us"
  className="max-w-[1240px] mx-auto pt-12 lg:pt-[67px] flex flex-col items-center justify-center pl-6 pr-6"
>
  {/* Title */}
  <motion.h1
    className="text-black text-[20px] lg:text-[40px] font-[600] text-center leading-normal lg:leading-[76px] uppercase"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    WHY JOIN TALENT CLOUD ?
  </motion.h1>

  {/* First Row */}
  <div className="mt-8 lg:mt-[48px] flex flex-col lg:flex-row gap-6 lg:gap-8 w-full justify-center items-center">
    <motion.div
      className="w-full max-w-full md:max-w-[80%] lg:w-[60%] lg:max-w-[697px] px-4 py-[42px] lg:p-6 bg-[#F1F7FF] rounded-[25px] shadow-[0_1px_3px_0_#A6AFC366] h-[534px] lg:h-[400px] flex flex-col lg:flex-row items-center gap-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <img src={getJobPromotionImg} alt="" className="max-w-[300px]" />
      <div className="flex flex-col gap-4">
        <h1 className="text-black text-[16px] lg:text-[20px] font-[600]">
          Career Support
        </h1>
        <p className="text-black text-[12px] lg:text-[16px] font-[400] max-w-full lg:max-w-[325px]">
          Support personalized career consultations, skill development and
          project opportunities aligned with your long-term goals. Gain the
          chance to work abroad and grow your career step by step for your
          professional journey.
        </p>
      </div>
    </motion.div>

    <motion.div
      className="w-full lg:w-[40%] max-w-full md:max-w-[80%] lg:max-w-[431px] p-8 bg-[#FCFCFC] rounded-[25px] shadow-[0_1px_3px_0_#A6AFC366] h-[393px] lg:h-[400px] flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      viewport={{ once: true }}
    >
      <img src={jobInterviewImg} alt="" className="max-w-[200px]" />
      <div className="mt-4">
        <h1 className="text-black text-[16px] lg:text-[20px] font-[600]">
          Stable Employment
        </h1>
        <p className="text-black text-[12px] lg:text-[16px] font-[400] mt-2">
          From legal contracts and tax filings to payroll and HR—our
          end-to-end support ensures your career runs smoothly and
          stress-free.
        </p>
      </div>
    </motion.div>
  </div>

  {/* Second Row */}
  <div className="mt-[32px] flex flex-col lg:flex-row-reverse gap-8 w-full justify-center items-center">
    <motion.div
      className="w-full md:w-[80%] lg:w-[60%] lg:max-w-[697px] p-6 bg-[#F1F7FF] rounded-[25px] shadow-[0_1px_3px_0_#A6AFC366] min-h-[393px] flex flex-col lg:flex-row items-center gap-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <img src={teamSuccessImg} alt="" className="max-w-[299px]" />
      <div className="flex flex-col gap-4 lg:max-w-[305px]">
        <h1 className="text-black text-[16px] lg:text-[20px] font-[600]">
          Secure Work Environment
        </h1>
        <p className="text-black text-[12px] lg:text-[16px] font-[400]">
          Work from a fully equipped office in Myanmar with backup power,
          high-speed internet, and a supportive team nearby—no more dealing
          with outages or isolation.
        </p>
      </div>
    </motion.div>

    <motion.div
      className="w-full md:w-[80%] lg:w-[40%] lg:max-w-[431px] p-8 bg-[#FCFCFC] rounded-[25px] shadow-[0_1px_3px_0_#A6AFC366] h-[417px] lg:h-[393px] flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      viewport={{ once: true }}
    >
      <img src={brainstormImg} alt="" className="max-w-[254px]" />
      <div className="w-full lg:max-w-[302px] ">
        <h1 className="text-black text-[16px] lg:text-[20px] font-[600]">
          Global Projects, Local Setup
        </h1>
        <p className="text-black text-[12px] lg:text-[16px] font-[400] mt-2">
          Work with international teams from Myanmar—no visas, no
          relocation.
        </p>
      </div>
    </motion.div>
  </div>
</div>
  )
}

export default WhyJoinTC