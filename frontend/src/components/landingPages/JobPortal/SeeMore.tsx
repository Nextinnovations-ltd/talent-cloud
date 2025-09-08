



import  { useState } from 'react'
import arrowIncrease from '../../../assets/JobPortal/streamline_graph-arrow-increase.svg'
import { motion } from "framer-motion";
const SeeMore = () => {
    const [showmore, setShowMore] = useState(false);  
  return (
  <div id="about-us" className="bg-[#F7F7F7] pr-[20px] pl-[20px]">
    <div className="max-w-[1240px] mx-auto flex lg:flex-row flex-col justify-between items-start pt-[119px] pb-[36px] bg-[#F7F7F7] gap-[64px]">
      {/* Left Side */}
      <div className="md:max-w-[772px] max-w-full">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[16px] md:text-[32px] leading-[35px] md:leading-[48px] font-[500] text-[#0481EF]"
        >
          Talent Cloud — Your Myanmar EOR partner for hiring top developers
          and designers, no local entity needed.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-[12px] md:text-[20px] leading-[27px] md:leading-[39px] font-[500] text-[#403E3E] mt-[20px] md:mt-[40px] mb-[25px]"
        >
          Talent Cloud is powered by Next Innovations Ltd. a trusted provider
          of EOR services since 2020 with a proven track record of success.
          <span
            className={`block transition-all duration-500 ease-in-out overflow-hidden ${
              showmore ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            Talent Cloud is a trusted Employer of Record (EOR) platform in
            Myanmar, designed to help global companies hire top IT
            professionals—from skilled developers to world-class
            designers—with full compliance and HR support. We handle legal
            employment, payroll, and workplace setup, so you can focus on
            scaling with the best talent from Myanmar.
          </span>
        </motion.p>

        {/* Toggle Button */}
          <motion.button
          initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="relative bg-black rounded-[16px] w-[124px] md:w-[140px] md:h-[47px] h-[40px] text-white text-[12px] md:text-[16px] font-[500] leading-[14px] md:leading-[39px] overflow-hidden group"
          onClick={() => setShowMore(!showmore)}
        >
          <span className="block relative z-10 transition-transform duration-300 group-hover:-translate-y-[47px]">
            {showmore ? "Show less" : "See more"}
          </span>
          <span className="block absolute top-full left-0 w-full text-white transition-transform duration-300 group-hover:-translate-y-[26px] md:group-hover:-translate-y-[45px] z-0">
            {showmore ? "Show less" : "See more"}
          </span>
        </motion.button>
      </div>

      {/* Right Side - Counters */}
      <div className="hidden md:flex flex-col justify-between gap-[90px]">
        {/* Counter 1 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center gap-4 items-center"
        >
          <div className="flex gap-2 justify-center items-start">
            <motion.h1
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
              className="text-[40px] font-[500] leading-[28px]"
            >
              +100
            </motion.h1>
            <img src={arrowIncrease} alt="" />
          </div>
          <p className="text-[#0481EF] text-[16px] font-[500] leading-7">
            Position available
          </p>
        </motion.div>

        {/* Counter 2 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center gap-4 items-center"
        >
          <div className="flex gap-2 justify-center items-start">
            <motion.h1
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              viewport={{ once: true }}
              className="text-[40px] font-[500] leading-[28px]"
            >
              +200
            </motion.h1>
            <img src={arrowIncrease} alt="" />
          </div>
          <p className="text-[#0481EF] text-[16px] font-[500] leading-7">
            Local Talent
          </p>
        </motion.div>
      </div>
    </div>
  </div>
  )
}

export default SeeMore
