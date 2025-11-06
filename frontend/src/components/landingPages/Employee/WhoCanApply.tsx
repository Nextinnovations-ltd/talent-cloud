import designerImg from '../../../assets/Employee/Illustrator Drawing With Ipad 4.png';
import frontendDeveloperImg from '../../../assets/Employee/Modular Coding 1.png';
import backendDeveloperImg from '../../../assets/Employee/Coding 1.png';     
import QAImg from '../../../assets/Employee/Business Presentation 1.png'
import { motion } from "framer-motion";
const WhoCanApply = () => {
  return (
 <div className="max-w-[1240px] mx-auto pt-[48px] pb-[48px] md:pt-[67px] md:pb-[92px] flex flex-col items-center justify-center gap-6 lg:gap-12 pr-[24px] pl-[24px]">
      
  {/* Title */}
  <motion.h1
    className="text-black text-[20px] md:text-[40px] font-[600] text-center"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    viewport={{ once: true }}
  >
    WHO CAN APPLY?
  </motion.h1>

  {/* Grid of roles */}
  <div className="w-full md:w-[80%] lg:w-full grid grid-cols-1 md:grid-cols-2 gap-4 lg:flex items-center justify-between">
        
    <motion.div
      className=""
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <img src={designerImg} alt="" className="mx-auto max-w-[200px]" />
      <p className="text-[16px] md:text-[20px] text-center font-[500]">
        UI/UX Designer
      </p>
    </motion.div>

    <motion.div
      className=""
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      viewport={{ once: true }}
    >
      <img
        src={frontendDeveloperImg}
        alt=""
        className="mx-auto max-w-[200px]"
      />
      <p className="text-[16px] md:text-[20px] text-center font-[500]">
        Frontend Developer
      </p>
    </motion.div>

    <motion.div
      className=""
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
      viewport={{ once: true }}
    >
      <img
        src={backendDeveloperImg}
        alt=""
        className="mx-auto max-w-[200px]"
      />
      <p className="text-[16px] md:text-[20px] text-center font-[500]">
        Backend Developer
      </p>
    </motion.div>

    <motion.div
      className=""
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      viewport={{ once: true }}
    >
      <img src={QAImg} alt="" className="mx-auto max-w-[200px]" />
      <p className="text-[16px] md:text-[20px] text-center font-[500]">
        QA Engineer
      </p>
    </motion.div>

  </div>
</div>
  )
}

export default WhoCanApply