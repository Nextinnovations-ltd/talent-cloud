import marqueeImg1 from '../../../assets/Employee/Rectangle 5668.png'
import marqueeImg2 from '../../../assets/Employee/Rectangle 5671.png'
import './WorkingEnviroment.css';
import { motion } from "framer-motion";

const WorkingEnviroment = () => {
  return (
    <div className="overflow-hidden bg-white py-10">
      <motion.h1 className='text-black text-[18px] md:text-[40px] font-[600] text-center mb-[24px] md:mb-[32px] mt-0 md:mt-[67px]'   initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}>
        OUR LOVELY WORKING ENVIRONMENT
      </motion.h1>

      <div className="marquee-container overflow-hidden whitespace-nowrap w-[90%] justify-self-end">
        <div className="marquee-content inline-flex animate-marquee gap-[23px]">
          {/* Repeat enough images to create a seamless loop */}
          <img src={marqueeImg1} alt="" className="w-[293px] md:w-[608px]" />
          <img src={marqueeImg2} alt="" className="w-[293px] md:w-[608px]" />
          <img src={marqueeImg1} alt="" className="w-[293px] md:w-[608px]" />
          <img src={marqueeImg2} alt="" className="w-[293px] md:w-[608px]" />
          <img src={marqueeImg1} alt="" className="w-[293px] md:w-[608px]" />
          <img src={marqueeImg2} alt="" className="w-[293px] md:w-[608px]" />
        </div>
      </div>
    </div>
  )
}

export default WorkingEnviroment
