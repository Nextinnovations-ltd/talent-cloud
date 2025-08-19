import {motion} from 'framer-motion'
import teamwork from '../../../assets/JobPortal/yong-group.png'
import icon1 from '../../../assets/JobPortal/Frame 36106.svg'
import icon2 from '../../../assets/JobPortal/Frame 36107.svg'
import icon3 from '../../../assets/JobPortal/Frame 36109.svg'
import icon4 from '../../../assets/JobPortal/Frame 36110.svg'
const ReasonToChoose = () => {
    return (
        <div id='why-us' className="bg-[#F9FAFB] md:mt-[96px] mt-[31px] pl-[20px] pr-[20px] ">
      <div className='max-w-[1240px] mx-auto md:pt-[83px] pt-[26px] pb-[61px] '>
          <h1 className='md:text-[40px] text-[16px] leading-[57px] font-[600] md:mb-[81px] mb-[35px]'>WHY CHOOSE TALENT CLOUD ?</h1>
          <div className="flex md:flex-row flex-col-reverse gap-[46px] md:gap-[100px] justify-center items-center flex-wrap lg:flex-nowrap">
              <div className="pt-[28px] w-full flex flex-col justify-center items-center">
                  <img src={ teamwork} className='md:mb-[30px] mb-[43px] md:ml-[49px] '/>
                  <p className='md:mb-[17px] mb-[8px]'>The EOR service is already in operation.</p>
                  <svg xmlns="http://www.w3.org/2000/svg" width="373" height="41" viewBox="0 0 373 41" fill="none" className='sm:w-full md:w-[373px]'>
                            <motion.path
                            viewport={{ once: true }} 
                              initial={{ pathLength: 0 }}
                              whileInView={{ pathLength: 1 }}
                              transition={{ duration: 1, ease: "easeInOut" }}
                              d="M3.00001 6.63059C109.985 83.9052 95.9107 -23.1759 204.85 27.497C297.495 70.5907 252.291 -36.5477 370 19.7855"
                              stroke="#0481EF"
                              strokeOpacity="0.48"
                              strokeWidth="5.75447"
                              strokeLinecap="round"
                            />
               
                        </svg>
                    </div>
                    <div className="grid md:grid-cols-2 grid-cols-[300px] md:gap-[73px] gap-[30px] ">
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon1} alt="" className='w-[38px] h-[38px] md:w-[52px] md:h-[50px]'/>
                            <h1 className='md:text-[20px] text-[14px] md:leading-[48px] leading-[39px] font-[600]'>Hire Without a Local Entity</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] md:text-[16px] text-[12px]'>Our EOR service becomes legal employer, enabling you to hire top talent quickly, compliantly, and cost-effectively.</p>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon3} alt="" className='w-[38px] h-[38px] md:w-[52px] md:h-[50px]'/>
                            <h1 className='md:text-[20px] text-[14px] md:leading-[48px] leading-[39px] font-[600]'>Specialized in IT Talent</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] md:text-[16px] text-[12px]'>We specialize in sourcing, onboarding, and managing elite IT professionals so employers can scale remote team with confidence and speed.</p>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon2} alt="" className='w-[38px] h-[38px] md:w-[52px] md:h-[50px]'/>
                            <h1 className='md:text-[20px] text-[14px] md:leading-[48px] leading-[39px] font-[600]'>Full HR & Payroll Compliance</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] md:text-[16px] text-[12px]'>We manage payroll, benefits, tax filings, and ensure complete compliance with Myanmar labor laws—freeing you from legal and enabling worries. </p>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <img src={icon4} alt="" className='w-[38px] h-[38px] md:w-[52px] md:h-[50px]'/>
                            <h1 className='md:text-[20px] text-[14px] md:leading-[48px] leading-[39px] font-[600] lg:text-nowrap'>Workplace & Equipment Support</h1>
                            <p className='text-[#484747] font-[500] leading-[23px] md:text-[16px] text-[12px]'>We provide everything  from workplace with backup generators, laptops to high-speed internet—ensuring productive work environment.</p>
                        </div>

                    </div>
                    
          </div>
            </div>
            </div>
  )
}

export default ReasonToChoose
