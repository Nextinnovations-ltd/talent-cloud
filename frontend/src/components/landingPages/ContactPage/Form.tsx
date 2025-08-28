import gradientImg from '@/assets/Employee/Contact us.png'
import contactImg from '@/assets/Employee/Frame 1618873031.png'
import mail from '@/assets/Employee/mail.svg';
import map from '@/assets/Employee/map.svg';
import phone from '@/assets/Employee/phone.svg';
import SendEmailForm from './SendEmailForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom';
const Form = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="">
  
     <div className='pt-[107px] md:pt-[233px] md:pb-[104px] px-6' style={{
        backgroundImage: `url(${gradientImg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100%',
      }}>
        <div className="p-0">
       <h1 className='text-black text-center text-[24px] md:text-[40px] font-[500] leading-[38px] md:leading-[64px]'>Contact us</h1>
      <p className='text-center text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[19px] md:leading-[38px] mt-[8px] md:mt-[22px] '>Do you have a question? Send us a message and we’ll get back to you soon.</p>
      <div className="flex justify-center items-center mt-[32px] md:mt-[50px]">
        <div className='flex justify-center items-center w-[100px] md:w-[167px] h-[39px] md:h-[65px] rounded-[16px] md:rounded-[24px] bg-[#0481EF] p-[10px] text-white leading-[24px] md:leading-[32px] text-[12px] md:text-[16px] font-[500] whitespace-nowrap'>Inquiry Detail</div>
      <div className={`mx-[4px] md:mx-[10px] border border-[3]  w-[24px] md:w-[170px] h-[1px] ${step >1 ?'border-dashed border-[#0481EF]':'border-dashed border-[#575757]'}`}></div> 
        <div className={`flex justify-center items-center w-[100px] md:w-[167px] h-[39px] md:h-[65px] rounded-[16px] md:rounded-[24px]   p-[10px]  leading-[24px] md:leading-[32px] text-[12px] md:text-[16px] font-[500] ${step > 1 ? 'bg-[#0481EF]  text-white':'text-[#575757] border-[2px] border-[#575757]'}`}>Confirmation</div>
      <div className={`mx-[4px] md:mx-[10px] border border-[3] w-[24px] md:w-[170px] h-[1px] ${step > 2 ?'border-dashed border-[#0481EF]':'border-dashed border-[#575757]'}`}></div> 
        <div className={`flex justify-center items-center w-[100px] md:w-[167px] h-[39px] md:h-[65px] rounded-[16px] md:rounded-[24px]   p-[10px]  leading-[24px] md:leading-[32px] text-[12px] md:text-[16px] font-[500] ${step > 2? 'bg-[#0481EF]  text-white':'text-[#575757] border-[2px] border-[#575757]'}`}>Delivering</div>

      </div>
     </div>
      
        <div className="max-w-[1170px] flex flex-col-reverse lg:flex-row justify-center gap-[76px]  md:gap-[50px] min-h-[753px] mx-auto mt-[60px]  md:pb-[70px] md:px-[54px] pb-[24px] px-[0px]  rounded-[18px] bg-transparent md:bg-white shadow-none md:shadow-[0_4px_12px_0_#0D0A2C0F]">
          <div className="w-full lg:max-w-[425px] pt-0 md:pt-[28px]">
          <Link to=''
            className='hidden lg:flex gap-3  justify-start items-center text-black text-[18px] font-[500] leading-[20px] mb-[48px] '
            onClick={() => setStep(1)}
            type="button"
            >
            <svg className='w-[24px] h-[24px]' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Back
          </Link>
          <div className="p-[32px] md:p-[40px] w-full rounded-[24px] lg:h-[594px] h-[378px]" style={{
              backgroundImage: `url(${contactImg})`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            width: '100%',
              
            
            }}>
            <h1 className='text-white text-[18px] md:text-[24px] font-[500] leading-[30px] md:leading-[38px] text-center'>Contact us</h1>
            <p className='text-white text-[12px] md:text-[16px] font-[500] leading-[20px] md:leading-[26px] text-center mt-[16px] md:mt-[20px] max-w-[271px] md:max-w-[345px] mx-auto'>Do you have a question? Send us a message and we’ll get back to you soon.</p>
            <div className="flex flex-col gap-[25px] md:gap-[32px] mt-[50px] md:mt-[64px]">
              <div className="flex gap-[8px] md:gap-[10px]  ">
                <img src={mail} alt="" className='w-[18px] md:w-[24px] h-[18px] md:h-[24px]'/>
                <p className='text-white text-[12px] md:text-[16px] font-[500] '>talentcloud@next-innovations.ltd</p>
             </div>
              <div className="flex gap-[8px] md:gap-[10px]  ">
                <img src={phone} alt="" className='w-[18px] md:w-[24px] h-[18px] md:h-[24px]'/>
                <p className='text-white text-[12px] md:text-[16px] font-[500] '>+95 945 166 3606</p>
             </div>
              <div className="flex gap-[8px] md:gap-[10px]  ">
                <img src={map} alt="" className='w-[18px] md:w-[24px] h-[18px] md:h-[24px]'/>
                <p className='text-white text-[12px] md:text-[16px] font-[500] '>Room No.(602), Gandamar Residence, Gandamar Road, Yangon</p>
             </div>
            </div>
          </div>
        </div>
        <SendEmailForm step={step} setStep={setStep}/>
      </div>
    </div>

   </div>
  )
}

export default Form