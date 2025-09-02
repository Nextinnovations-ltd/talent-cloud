import linearBg from '../../../assets/Employee/Frame 36553.png'
import CommonButton from '../commonBtn/button';
import { motion } from "framer-motion";
const JoinBanner = () => {


  return (
   <div
    style={{
      backgroundImage: `url(${linearBg})`,
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "100%",
    }}
    className="flex flex-col items-center justify-center gap-4 md:gap-[32px] md:py-[98px] py-[39px] px-[24px]"
  >
    {/* Heading */}
    <motion.h1
      className="text-black text-[18px] md:text-[40px] font-[600] text-center leading-[34.2px] md:leading-[76px] uppercase"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      Ready to Work on International Projects?
    </motion.h1>

    {/* Paragraph */}
    <motion.p
      className="text-black text-[12px] md:text-[20px] font-[500] text-center leading-[20px] md:leading-[38px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      viewport={{ once: true }}
    >
      Get matched with companies in Japan and beyond — from right here in Myanmar.
    </motion.p>

    {/* Button */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
      viewport={{ once: true }}
    >
      <CommonButton title="Join Talent Cloud" url="/" />
    </motion.div>
  </div>
  )
}

export default JoinBanner