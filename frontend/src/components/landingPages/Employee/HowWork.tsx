import { motion } from "framer-motion";
import createAccImg from '../../../assets/Employee/Create Account 4.png';
import hiringImg from '../../../assets/Employee/Hiring 3.png';
import getPromotionImg from '../../../assets/Employee/Get Job Promotion 4.png';

const HowWork = () => {
  return (
    <div className="max-w-[1240px] mx-auto py-[48px] md:py-[67px]">
      {/* Title */}
      <motion.h1
        className="text-black text-[20px] md:text-[40px] font-[600] text-center mb-[24px] md:mb-[58px] uppercase"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        How it Works?
      </motion.h1>

      {/* Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 justify-between justify-items-center p-[10px] gap-[20px]">
        
        {/* Step 1 */}
        <motion.div
          className="max-w-[300px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img src={createAccImg} alt="" />
          <h1 className="text-black md:text-[24px] text-[20] font-[600] mt-[24px] leading-normal text-center">
            Create Profile
          </h1>
          <p className="text-[#575757] text-[14px] md:text-[16px] font-[500] text-center">
            Add your skills and experience get matched faster.
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          className="max-w-[300px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img src={hiringImg} alt="" />
          <h1 className="text-black md:text-[24px] text-[20] font-[600] mt-[24px] leading-normal text-center">
            Get Matched
          </h1>
          <p className="text-[#575757] text-[14px] md:text-[16px] font-[500] text-center">
            We’ll connect you with jobs that fit your skills and career goals.
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          className="max-w-[300px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          viewport={{ once: true }}
        >
          <img src={getPromotionImg} alt="" />
          <h1 className="text-black md:text-[24px] text-[20] font-[600] mt-[24px] leading-normal text-center">
            Start Working
          </h1>
          <p className="text-[#575757] text-[14px] md:text-[16px] font-[500] text-center">
            Begin your new role with confidence backed by our full support every step.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default HowWork;
