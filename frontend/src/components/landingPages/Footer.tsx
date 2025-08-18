import TalentCloudLogo from "@/assets/Employee/Vector (3).svg";
import footerIcon1 from "@/assets/Employee/Frame (1).svg";
import footerIcon2 from "@/assets/Employee/Frame (3).svg";
import footerIcon3 from "@/assets/Employee/image.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
      <div className='bg-[#191B1D] w-full '>
          <div className="max-w-[1240px] mx-auto pt-[50px]  flex flex-col md:flex-row justify-between items-start md:items-start pl-6 md:pl-0 gap-[92px] md:gap-0">
          <div className="flex flex-col gap-6 md:gap-8 justify-center">
                  <img src={TalentCloudLogo} alt="" className='w-[186px] md:w-[293px]'/>
                  <p className='text-white text-[18px] font-[400] leading-[25.2px ] tracking-[0.36px]'>Unlock your next career journey  </p>
              </div>
              <div className="">
                  <p className='text-white text-[20px] font-[700] leading-[28px ] tracking-[0.4px] text-right'>Follow us on our socials</p>
                  <div className="mt-4 mb-10 flex justify-end items-center gap-[42px]">
                      <Link to={""}>
                      <img src={footerIcon3} alt="" />
                      </Link>
                      <Link to={""}>
                      <img src={footerIcon2} alt="" />
                      </Link>
                      <Link to={""}>
                      <img src={footerIcon1} alt="" />
                      </Link>
                  </div>
                  <p className=' text-white text-[16px] font-[500] leading-[26px ] text-left md:text-right'>No.(602), Gandamar Residence,<br/> Gandamar Road, Yangon.</p>
                  <p className='text-white text-[16px] font-[500] leading-[25px ] mt-4 text-left md:text-right'>+95 980 971-24-19</p>
             
              </div>
         </div>
          <p  className='text-white text-[14px] font-[400] leading-[25px ] tracking-[0.56px] text-left md:text-center pt-[46px] md:pt-[72px] pb-[30px]'>Copyright @Talent Cloud, 2025</p>
      </div>
      
  )
}

export default Footer