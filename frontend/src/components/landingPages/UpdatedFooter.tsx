
import './Footer.css'
import icon1 from "@/assets/Group 2339.svg";
import icon2 from "@/assets/Group 2340.svg";
import icon3 from "@/assets/Group 2341.svg";
const UpdatedFooter = () => {
  return (
    <div className='bg-[#000] w-full '>
        <div className="max-w-[1240px] mx-auto pt-[40px] md:pt-[77px] pl-5 pr-5">
        <div className="flex flex-col justify-start md:flex-row md:justify-between">
          <div className="max-w-[172px]">
            <h1 className="text-[20px] text-[#F2F2F2] font-[500] leading-[32px] mb-[15px] ml-[14px] md:ml-[40px]">Explore</h1>
            <div className="w-full h-[1px] bg-[#0481EF] mb-[20px] md:mb-[25px]"></div>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ml-[14px] md:ml-[40px]">What You Get</p>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ml-[14px] md:ml-[40px]">Why us</p>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] ml-[14px] md:ml-[40px] mb-[45px] md:mb-0">Find Jobs</p>
          </div>
          <div className="max-w-[172px]">
            <h1 className="text-[20px] text-[#F2F2F2] font-[500] leading-[32px] mb-[15px] ml-[14px] md:ml-[40px]">About</h1>
            <div className="w-full h-[1px] bg-[#0481EF] mb-[25px]"></div>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ml-[14px] md:ml-[40px]">Contact us</p>

          </div>
          <div className="max-w-[172px]">
            <h1 className="text-[20px] text-[#F2F2F2] font-[500] leading-[32px] mb-[15px] md:mb-[75px] ml-[14px] md:ml-[40px]  mt-[57px] mt-0">Upcoming</h1>
            <div className="w-full h-[1px] bg-[#0481EF] mb-[25px]"></div>
            <p className="text-[16px] text-[#fff] font-[500] leading-[28px] mb-[12px] ml-[14px] md:ml-[40px]">Blog</p>
          
          </div>
          <div className="max-w-[289px]">
            <h1 className="text-white text-[40px] font-[500] leading-[64px] mb-[15px] md:mb-[44px] ml-[0px] md:ml-[40px] mt-[75px] md:mt-0">Get in touch</h1>
            <p className=' text-white text-[16px] font-[500] leading-[26px ] text-left md:text-right '>No.(602), Gandamar Residence,<br/> Gandamar Road, Yangon.</p>
            <p className='text-white text-[16px] font-[500] leading-[25px ] mt-4 text-left md:text-right'>+95 980 971-24-19</p>
             
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-[64px] md:mt-[166px] gap-[25px] md:gap-0">
        <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Copyright @Talent Cloud, 2025</p>
          <div className="flex gap-[18px]">
<img src={icon1} alt="" />
<img src={icon2} alt="" />
<img src={icon3} alt="" />
          </div>
          <div className="flex gap-[30px] md:gap-4 flex-wrap ">
          <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Cookie Sitting</p>
          <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Privacy Policy</p>
          <p  className='text-white text-[16px] font-[500] leading-[25px ] tracking-[0.64px] '>Terms & Conditions </p>

          </div>
        </div>
       </div>
        <p  className='text-[#0389FF] whitespace-nowrap text-[14.4vw] font-[500] leading-[160%] text-center uppercase font-[Pridi]'>Talent Cloud</p>
    </div>
    
)
}

export default UpdatedFooter