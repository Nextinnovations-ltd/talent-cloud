
import './Footer.css'
import icon1 from "@/assets/linkedin.svg";
import icon2 from "@/assets/facebook.svg";
import icon3 from "@/assets/viber.svg";
import TalentCloudImg from "@/assets/Talent Cloud.png";
import { HashLink } from 'react-router-hash-link';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const UpdatedFooter = () => {
  const location = useLocation();
  const isEmpLp = location.pathname === "/emp/lp";
  return (
    <div className='bg-[#000] w-full relative '>
        <div className="max-w-[1240px] mx-auto pt-[40px] md:pt-[77px] pl-5 pr-5">
        <div className="flex flex-col justify-start md:flex-row md:justify-between gap-5">
          <div className="w-[203px]">
            <h1 className="text-[20px] text-[#F2F2F2] font-[500] leading-[32px] mb-[15px] ">Explore</h1>
            <div className="w-full h-[1px] bg-[#0481EF] mb-[20px] md:mb-[25px]"></div>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px]">
              {isEmpLp ? (
                <HashLink smooth to="#about-us">About Us</HashLink>
              ) : (
                <HashLink smooth to="#what-you-get">What You Get</HashLink>
              )}
            </p>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ">
              <HashLink smooth to="#why-us">Why us</HashLink>
            </p>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px]  mb-[45px] md:mb-0">
              
              {!isEmpLp && (
              <HashLink smooth to="#find-jobs">Find Jobs</HashLink>
              ) }
            </p>
          </div>
          <div className="w-[203px]">
            <h1 className="text-[20px] text-[#F2F2F2] font-[500] leading-[32px] mb-[15px] ">About</h1>
            <div className="w-full h-[1px] bg-[#0481EF] mb-[25px]"></div>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ">Contact us</p>

          </div>
          <div className="w-[203px]">
            <h1 className="text-[20px] text-[#F2F2F2] font-[500] leading-[32px] md:mb-[15px] mb-[15px]  mt-[57px]  md:mt-0">Upcoming</h1>
            <div className="w-full h-[1px] bg-[#0481EF] mb-[25px]"></div>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ">Blog</p>
          
          </div>
          <div className="max-w-[289px] flex flex-col items-start md:items-end">
            <h1 className="text-white text-[40px] font-[500] leading-[64px] mb-[15px] md:mb-[44px] ml-[0px] md:ml-[40px] mt-[75px] md:mt-0">Get in touch</h1>
            <p className=' text-white text-[16px] font-[500] leading-[26px ] text-left md:text-right '>No.(602), Gandamar Residence,<br/> Gandamar Road, Yangon.</p>
           <a href="tel:+959451663606" target='_blank' className='text-white text-[16px] font-[500] leading-[25px ] mt-4 text-left md:text-right'>+95 945 166 3606</a>

          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-[64px] md:mt-[166px] gap-[25px] md:gap-0">
        <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Copyright © Talent Cloud 2025</p>
          <div className="flex gap-[18px] order-[-1] md:order-[0]">
            <Link to='https://www.linkedin.com/company/99166393/admin/inbox/' target='_blank'>
            
              <img src={icon1} alt="" className='w-[48px] h-[48px] ' />

            </Link>
 <Link to='https://www.facebook.com/profile.php?id=61578628769861' target='_blank'>
              <img src={icon2} alt="" className='w-[48px] h-[48px] '/>

            </Link>
 <Link to='tel:+959451663606' target='_blank'>

              <img src={icon3} alt="" className='w-[48px] h-[48px] '/>

            </Link>
          </div>
          <div className="flex md:flex-row flex-col gap-[30px] md:gap-4 flex-wrap ">

          <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Privacy Policy</p>
          <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Terms & Conditions </p>

          </div>
        </div>
       </div>
      {/*  <span  className='text-[#0389FF] whitespace-nowrap text-[14.4vw] font-[500] leading-[160%] text-center uppercase font-[Pridi] '>Talent Cloud</span> */}
      <img src={TalentCloudImg} alt="" className='mt-[44px] md:mt-[132px]' />
    </div>
    
)
}

export default UpdatedFooter